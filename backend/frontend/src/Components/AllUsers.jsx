import React, { useContext, useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import { ToastContainer, toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";
import {
  useFetchAllUserNamesMutation,
  useAddFriendMutation,
} from "../services/appApi";

import "react-toastify/dist/ReactToastify.css";
import "../styles/AllUsers.css";
import "swiper/css";
import "swiper/css/navigation";
import NoUserFound from "./NoUserFound";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { IconButton } from "@mui/material";
import { useMemo } from "react";

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

const AllUsers = () => {
  const user = useMemo(() => JSON.parse(sessionStorage.getItem("user")), []);
  // const user = useSelector((state) => state.user);
  const [allUsersFetch] = useFetchAllUserNamesMutation(),
    [addFriendFunc] = useAddFriendMutation();
  const { allUsers, setAllUsers } = useContext(AppContext);
  const [currDisable, setCurrDisable] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById("add-friend-page").style.display = "none";

    allUsersFetch({ user }).then(async ({ data, error }) => {
      await setAllUsers(data);
      document.getElementById("loading-spinner").style.display = "none";
      document.getElementById("add-friend-page").style.display = "";
    });
  }, [setAllUsers, user, allUsersFetch]);

  async function search(e) {
    await allUsersFetch({ user }).then(async ({ data, error }) => {
      if (data) {
        const newResults = [];
        for (let currFriend of data) {
          if (currFriend?.name?.includes(e, 0) === true)
            newResults.push(currFriend);
        }
        setAllUsers(newResults);
      }
    });
  }

  async function refresh() {
    // window.location.reload(false);
    navigate("/AllUsers");
  }

  if (!user) return <></>;

  return (
    <>
      <ReactLoading
        type="spinningBubbles"
        color="#1261a0"
        id="loading-spinner"
        className="loading-spinner"
      />
      <div className="add-friend-page" id="add-friend-page">
        <div className="title-and-search-bar">
          <h3 className="friends-title">Add New Friends</h3>
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
              placeholder="Search by username…"
              inputProps={{ "aria-label": "search" }}
              autoComplete="off"
            />
            <IconButton onClick={() => { document.getElementById("my-search-bar").value = ""; search("") }}>
              <CloseIcon  />
            </IconButton>
          </Search>
        </div>

        <Swiper
          modules={[Navigation]}
          spaceBetween={50}
          navigation={true}
          draggable={true}
          className="show-users"
          speed={800}
        >
          {allUsers?.length === 0 ? (
            <SwiperSlide className="no-user-details">
              <NoUserFound />
            </SwiperSlide>
          ) : (
            ""
          )}
          {allUsers?.map(
            (member) =>
              user._id !== member._id && (
                <SwiperSlide key={member?._id} className="single-user-details">
                  <div className="card single-user-card">
                    <img
                      className="card-img-top single-user-image"
                      onClick={() => {
                        navigate(`/view?user=${member?.name}`);
                      }}
                      src={member.picture}
                      alt="user-pic"
                    />
                    <div className="card-body">
                      <h4 className="single-user-name border-left">
                        <p>{member.name}</p>
                      </h4>

                      {/* <div className="mutuals">3+ mutual friends</div> */}

                      <div className="action-buttons">
                        <button
                          disabled={member._id === currDisable}
                          className="btn btn-success add-button"
                          onClick={async () => {
                            setCurrDisable(member?._id);
                            await addFriendFunc({ user, reqForFriend: member });
                            toast.success("Request Sent", {
                              position: "top-right",
                              autoClose: 1500,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                            });
                            setTimeout(refresh, 2000);
                          }}
                        >
                          Add Friend
                        </button>

                        <button
                          onClick={() => {
                            navigate(`/view?user=${member.name}`);
                          }}
                          className="btn btn-primary view-button"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              )
          )}
        </Swiper>
        <ToastContainer />
      </div>
    </>
  );
};

export default AllUsers;
