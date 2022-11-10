import React, { useContext, useEffect, useState, useMemo } from "react";
import { AppContext } from "../context/appContext";
import { GoPrimitiveDot } from "react-icons/go";
import { IoMdExit } from "react-icons/io";
import ReactLoading from "react-loading";
import { faPaperPlane, faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  // useFetchMessagesMutation,
  useSendMessageMutation,
  useFetchFriendsMutation,
  useJoinRoomMutation,
  useUserCurrentStateMutation,
} from "../services/appApi";
import "../styles/chat.css";
import "../styles/Sidebar.css";
import "../styles/MessageForm.css";
import "bootstrap/dist/css/bootstrap.min.css";

import EmojiPicker from 'emoji-picker-react';

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AddReactionIcon from '@mui/icons-material/AddReaction';
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { IconButton } from "@mui/material";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  zIndex: 99,
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "white",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const Chat = () => {
  const user = useMemo(() => JSON.parse(sessionStorage.getItem("user")), []);
  const navigate = useNavigate();
  const { friends, setFriends, messages, setMessages } = useContext(AppContext);
  const [fetchFriends] = useFetchFriendsMutation();
  const [joinRoomAPI] = useJoinRoomMutation();
  const [currentStateFunc] = useUserCurrentStateMutation();
  const [sendNewMessage] = useSendMessageMutation();
  const [currentRoom, setCurrentRoom] = useState(null);
  const [message, setMessage] = useState("");
  const [sendIcon, setSendIcon] = useState(faPaperPlane);
  const [activeChatFriend, setActiveChatFriend] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isEmojiActive, setIsEmojiActive] = useState(false);

  useEffect(() => {
    document.getElementById("chat-main-outer").style.display = "none";

    joinRoomAPI({ currUser: user, roomId: null });
    fetchFriends({ user }).then(async ({ data, error }) => {
      if (error) {
        document.getElementById("loading-spinner").style.display = "none";
      } else {
        await setFriends(data);
        document.getElementById("loading-spinner").style.display = "none";
        document.getElementById("second-slide").style.display = "none";
        document.getElementById("chat-main-outer").style.display = "";
      }
    });
    setActiveChatId(null);
  }, [setFriends, user, fetchFriends, joinRoomAPI]);

  async function refresh() {
    navigate("/chat");
  }

  async function search(e) {
    await fetchFriends({ user }).then(async ({ data, error }) => {
      if (data) {
        const newResults = [];
        for (let currFriend of data) {
          if (currFriend?.name?.includes(e, 0) === true)
            newResults.push(currFriend);
        }
        setFriends(newResults);
      }
    });
  }

  async function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();

    month = month.length > 1 ? month : "0" + month;
    day = day.length > 1 ? day : "0" + day;

    return month + "/" + day + "/" + year;
  }

  async function sortTwoId(id1, id2) {
    id1 = await id1.toString();
    id2 = await id2.toString();

    if (id1 > id2) return id1 + "-" + id2;
    else return id2 + "-" + id1;
  }

  const todayDate = getFormattedDate();

  async function joinRoom(friend) {
    document.getElementById("loading-spinner").style.display = "flex";
    document.getElementById("first-slide").style.display = "none";
    document.getElementById("second-slide").style.display = "none";

    const roomId = await sortTwoId(friend._id.toString(), user._id.toString());

    await currentStateFunc({ user }).then(async ({ data, error }) => {
      if (roomId === data?.currentRoom) setActiveChatId(friend?.name);
      else setActiveChatId(null);
    });

    setActiveChatFriend(friend);
    setCurrentRoom(roomId);

    await joinRoomAPI({ currUser: user, roomId: roomId }).then(
      async ({ data, error }) => {
        if (data) await setMessages(data);

        document.getElementById("loading-spinner").style.display = "none";
        document.getElementById("second-slide").style.display = "flex";
      }
    );
    if (friend.currentRoom === roomId) setActiveChatId(friend.name);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (message === "") return;

    const today = new Date();
    const minutes =
      today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ":" + minutes;

    const newMessageResponse = await sendNewMessage({
      room: currentRoom,
      content: message,
      sender: user,
      time: time,
      date: await todayDate,
      receiver: activeChatFriend,
    });

    if (newMessageResponse.data){
      await setMessages(newMessageResponse.data);
      fetchFriends({ user }).then(({data, error}) => {
        if(data){
          setFriends(data);
        }
      });
    } 

    setMessage("");
    setSendIcon(faPaperPlane);
  }

  function onEmojiClick(event){
    setMessage((state) => state + event.emoji);
  }

  if (!user) {
    return <></>;
  }

  return (
    <>
      <ReactLoading
        type="spinningBubbles"
        color="#1261a0"
        id="loading-spinner"
        className="loading-spinner"
      />
      <div id="chat-main-outer" className="chat-main-outer">
        <div className="first-slide" id="first-slide">
          <div className="sidebar-outer">
            <div className="title-and-search-bar">
              <h3 className="friends-title">Friends</h3>
              <Search id="my-search-bar-wrapper">
                <SearchIconWrapper>
                  <SearchIcon style={{ color: "white" }} />
                </SearchIconWrapper>
                <StyledInputBase
                  onKeyUp={(e) => {
                    e.preventDefault();
                    search(e.target.value);
                  }}
                  id="my-search-bar"
                  placeholder="Search Friends…"
                  inputProps={{ "aria-label": "search" }}
                  autoComplete="off"
                />
                <IconButton
                  onClick={() => {
                    document.getElementById("my-search-bar").value = "";
                    search("");
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Search>
            </div>

            <div className="users-friends-list">
              {friends?.map((member) => (
                <div
                  className="users-friends-list-item"
                  style={{ cursor: "pointer" }}
                  onClick={async () => {
                    await joinRoom(member);
                  }}
                  key={member?.name}
                >
                  <div className="users-friend-pic">
                    <img
                      style={{
                        width: "inherit",
                        height: "inherit",
                        borderRadius: "50%",
                        margin: 0,
                        padding: 0,
                        objectFit: "contain",
                        border: "2px solid #1261a0",
                      }}
                      src={member?.picture}
                      alt="users-friend"
                    />
                    <GoPrimitiveDot
                      style={{
                        color: "green",
                        position: "absolute",
                        bottom: 0,
                        right: -1,
                        zIndex: 99,
                        height: 20,
                        width: 20,
                        display: activeChatId === member?.name ? "" : "none",
                      }}
                    />
                  </div>
                  <div className="users-friend-name">
                    <p className="friend-name">{member?.name}</p>
                    {/* <p className="friend-name">abcdefghijklmnopqrstuvwxyzabcd</p> */}
                    <small className="last-message-content">
                      {/* {(sortTwoId(user._id, member._id))} */}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="second-slide" className="second-slide">
          {currentRoom !== null && (
            <div id="outer-container" className="outer-container">
              <div id="message-output" className="message-output">
                {activeChatFriend && (
                  <div className="active-chat-outer">
                    <div className="active-chat-user-details">
                      <div
                        className="active-user-image"
                        onClick={() => {
                          navigate(`/view?user=${activeChatFriend?.name}`);
                        }}
                      >
                        <img
                          style={{
                            width: 55,
                            height: 55,
                            borderRadius: "50%",
                            margin: "0 .3rem",
                            border: "2px solid #1261a0",
                          }}
                          src={activeChatFriend.picture}
                          alt="activer-chat-user"
                        />
                      </div>
                      <div className="active-chat-user-name-status">
                        <p className="active-chat-user-name">
                          {activeChatFriend.name}
                        </p>
                        <p className="active-chat-user-status">
                          {activeChatId === activeChatFriend.name
                            ? "In the Chat"
                            : ""}
                        </p>
                      </div>
                      <IoMdExit
                        id="exit-chat-icon"
                        className="exit-chat-icon"
                        onClick={async () => {
                          setCurrentRoom(null);
                          refresh();
                          document.getElementById("first-slide").style.display =
                            "flex";
                          document.getElementById(
                            "second-slide"
                          ).style.display = "none";
                        }}
                        style={{
                          width: 30,
                          height: 30,
                          cursor: "pointer",
                          color: "#1261a0",
                          margin: "0 1rem",
                        }}
                      />
                    </div>
                  </div>
                )}
                {user && (
                  <div className="message-class">
                    <div
                      className="active-chat-messages"
                      id="active-chat-messages"
                    >
                      {messages?.map(({ _id: date, messageByDate }, index) => (
                        <div className="messages" key={index}>
                          <p className="alert alert-primary text-center message-date-indicator">
                            {date}
                          </p>

                          <div className="set-messages">
                            {messageByDate?.map(
                              ({ content, time, from: sender }, index) => (
                                <div
                                  key={index}
                                  className={
                                    sender === user.name
                                      ? "message-by-current-user"
                                      : "message-by-friend"
                                  }
                                >
                                  <div
                                    className="show-message-as-output"
                                    id={
                                      sender === user.name
                                        ? "message-by-current-user"
                                        : "message-by-friend"
                                    }
                                  >
                                    <p className="message-content">{content}</p>
                                    <p className="message-sent-time">{time}</p>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div style={{display: isEmojiActive ? "flex" : "none"}} className="emoji-class">
                <EmojiPicker onEmojiClick={onEmojiClick} height={400} width={300} />
              </div>
              <form
                className="chat-form-main"
                style={{
                  background: "none",
                  display: currentRoom == null ? "none" : "flex",
                }}
                onSubmit={handleSubmit}
              >
                <IconButton onClick={() => { setIsEmojiActive((state) => !state); } }>
                  <AddReactionIcon className="add-emoji-input-icon" />
                </IconButton>
                <input
                  className="user-message-input"
                  type="text"
                  placeholder="Type your message here"
                  disabled={!user || !currentRoom}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (e.target.value.length > 0) setSendIcon(faShare);
                    else setSendIcon(faPaperPlane);
                  }}
                />
                <div className="form-button">
                  <button
                    className="btn btn-primary"
                    style={{ borderRadius: "50%", height: "100%" }}
                    type="submit"
                    disabled={!currentRoom || !user}
                  >
                    <FontAwesomeIcon icon={sendIcon} />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
