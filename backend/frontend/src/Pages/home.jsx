import React, { useEffect, useState } from "react";
import { Button as ButtonRB } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  useFetchRelevantPostsMutation,
  useLikeThePostMutation,
  useCommentOnPostMutation,
  useDeletePostMutation,
} from "../services/appApi";
import Tooltip from "@mui/material/Tooltip";
import ReactLoading from "react-loading";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import NearMeIcon from "@mui/icons-material/NearMe";
import DeleteIcon from "@mui/icons-material/Delete";

import Button from "@mui/material/Button";
import { IconButton, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import "../styles/home.css";
import "../styles/CreatePost.css";

const Home = () => {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));
  const [isPostAvailable, setIsPostAvailable] = useState(null);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [openLikesDialog, setOpenLikesDialog] = useState(false);
  const [currPostLikesClick, setCurrPostLikesClick] = useState(null);
  const [openCommentsDialog, setOpenCommentsDialog] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [fetchPosts] = useFetchRelevantPostsMutation();
  const [likePost] = useLikeThePostMutation();
  const [postComment] = useCommentOnPostMutation();
  const [deletePostFunc] = useDeletePostMutation();
  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById("row-main").style.display = "none";
    document.getElementById("loading-spinner").style.display = "flex";
    fetchPosts({ user }).then(async ({ data, error }) => {
      if (data?.length > 0) {
        setIsPostAvailable(data);
      }
      document.getElementById("loading-spinner").style.display = "none";
      document.getElementById("row-main").style.display = "flex";
    });
  }, [fetchPosts, user]);

  window.addEventListener(
    "storage",
    function () {
      setUser(JSON.parse(this.sessionStorage.getItem("user")));
    },
    false
  );

  function verify(list) {
    for (const currUser of list) {
      if (currUser.name === user?.name) return true;
    }
    return false;
  }

  async function likeAction(postDetails) {
    likePost({ post: postDetails, user: user }).then(({ data, error }) => {
      if (data) {
        const newPostData = isPostAvailable?.map((currData) => {
          if (currData.postId.postDetails._id === data._id)
            return {
              postId: {
                postDetails: data,
                postOwnerDetails: currData.postId.postOwnerDetails,
              },
            };

          return currData;
        });
        setIsPostAvailable(newPostData);
      }
    });
  }

  async function commentAction() {
    if (commentContent === "") return;

    await postComment({
      user,
      comment: commentContent,
      currPostDetails: currPostLikesClick,
    }).then(async ({ data, error }) => {
      if (error) {
        toast.error(error, {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        setCurrPostLikesClick(data);
        toast.success("Comment posted successfully", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    });
    document.getElementById("new-comment-input").value = "";
    setCommentContent("");
  }

  return (
    <>
      <ReactLoading
        type="spinningBubbles"
        color="#1261a0"
        id="loading-spinner"
        className="loading-spinner"
      />
      {/**
       * @DialogForLikes
       */}
      <Dialog
        onClose={() => {
          setOpenLikesDialog(false);
          setCurrPostLikesClick(null);
        }}
        open={openLikesDialog}
      >
        <DialogTitle>Likes</DialogTitle>
        <DialogContent>
          {currPostLikesClick?.postLikedBy?.map((currUser) => (
            <div key={currUser?.name} className="data-of-user">
              <img
                src={currUser?.picture}
                className="post-owner-pic"
                id="post-owner-pic"
                alt="user-pic"
              />
              <div className="username-location">
                <p className="user-name-post">{currUser?.name}</p>
              </div>
            </div>
          ))}
        </DialogContent>
      </Dialog>
      {/**
       * @DialogForComments
       */}
      <Dialog
        onClose={() => {
          setOpenCommentsDialog(false);
          setCurrPostLikesClick(null);
        }}
        open={openCommentsDialog}
      >
        <DialogTitle>Comments</DialogTitle>
        <DialogContent>
          <div id="show-comments-box">
            {currPostLikesClick?.comments?.map(
              ({ commentContent, userPosted }, index) => (
                <div key={index} className="data-of-user">
                  <img
                    src={userPosted?.picture}
                    className="post-owner-pic"
                    id="post-owner-pic"
                    alt="user-pic"
                  />
                  <div className="username-location">
                    <p className="user-name-post">{userPosted?.name}</p>
                    <p>{commentContent}</p>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="comment-actions">
            <TextField
              autoFocus
              margin="dense"
              id="new-comment-input"
              label="Add your comment"
              type="text"
              fullWidth
              variant="standard"
              onKeyUp={(e) => {
                setCommentContent(e.target.value);
              }}
            />
            <IconButton
              onClick={() => {
                commentAction();
              }}
            >
              <NearMeIcon style={{ color: "#1261a0" }} />
            </IconButton>
          </div>
        </DialogContent>
      </Dialog>
      <Swiper
        modules={[Navigation]}
        spaceBetween={50}
        navigation={true}
        draggable={true}
        id="row-main"
        speed={800}
        className="show-users-posts"
      >
        {!isPostAvailable && (
          <SwiperSlide
            md={6}
            id="no-posts-id"
            className="d-flex flex-direction-column align-items-center justify-content-center"
          >
            <div className="whole-cover-div">
              <h1 className="title">Share the World with your Friends!!</h1>

              <LinkContainer to={user ? "/chat" : "/login"}>
                <ButtonRB className="cover-button">
                  Get Started{" "}
                  <i className="fas fa-comments home-message-icon"></i>
                </ButtonRB>
              </LinkContainer>
            </div>
          </SwiperSlide>
        )}
        {isPostAvailable?.map(
          ({ postId: { postOwnerDetails, postDetails } }) => (
            <SwiperSlide key={postDetails?._id} className="single-user-details">
              <div key={postDetails?._id} className="card curr-post-div">
                <div style={{ cursor: "pointer" }} className="data-of-user">
                  <div
                    onClick={() => {
                      navigate(`/view?user=${postOwnerDetails?.name}`);
                    }}
                    className="data-of-user"
                  >
                    <img
                      src={postOwnerDetails?.picture}
                      className="post-owner-pic"
                      id="post-owner-pic"
                      alt="user-pic"
                    />
                    <div className="username-location">
                      <p className="user-name-post">{postOwnerDetails?.name}</p>
                    </div>
                  </div>
                  {postOwnerDetails?.name === user.name && (
                    <IconButton
                      onClick={async () => {
                        if (
                          window.confirm(
                            "Confirm that you want to delete the post"
                          )
                        ) {
                          await deletePostFunc({
                            postDetails,
                            user
                          }).then(({data, error}) => {
                            if (data) {
                              if(data.length > 0)
                                setIsPostAvailable(data);
                              else
                                setIsPostAvailable(null);
                                
                              toast.success("Post Deleted Successfully", {
                                position: "top-right",
                                autoClose: 1500,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                              });
                            } else {
                              toast.error(error, {
                                position: "top-right",
                                autoClose: 1500,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                              });
                            }
                          });
                        }
                      }}
                      className="delete-icon"
                    >
                      <DeleteIcon style={{ color: "#1261a0" }} />
                    </IconButton>
                  )}
                </div>
                <img
                  className="home-post-pic"
                  src={postDetails?.postPicture}
                  alt="post-pic-preview"
                />
                <div className="card-body post-card-body">
                  <div className="caption-div">
                    <p className="post-owner-p">{postOwnerDetails?.name}</p>
                    <p className="post-caption-p">
                      {showFullCaption === false &&
                        postDetails?.caption
                          ?.substr(
                            0,
                            postDetails?.caption?.search("\n") !== -1
                              ? postDetails?.caption?.search("\n")
                              : postDetails?.caption?.length
                          )
                          ?.split("\n")
                          ?.map((item, index) => (
                            <span className="post-caption-span" key={index}>
                              {item}
                            </span>
                          ))}
                      {showFullCaption === true &&
                        postDetails?.caption
                          ?.split("\n")
                          ?.map((item, index) => (
                            <span className="post-caption-span" key={index}>
                              {item}
                            </span>
                          ))}
                      {postDetails?.caption?.search("\n") !== -1 &&
                        showFullCaption === false &&
                        postDetails?.caption?.length > 15 && (
                          <Button
                            onClick={() => setShowFullCaption(true)}
                            variant="light"
                          >
                            show more...
                          </Button>
                        )}
                      {postDetails?.caption?.search("\n") !== -1 &&
                        showFullCaption === true && (
                          <Button
                            onClick={() => setShowFullCaption(false)}
                            variant="light"
                          >
                            show less...
                          </Button>
                        )}
                    </p>
                  </div>
                  <div className="post-action-buttons">
                    <Tooltip title="Likes" arrow>
                      <IconButton
                        onClick={() => {
                          likeAction(postDetails);
                        }}
                      >
                        {verify(postDetails?.postLikedBy) ? (
                          <FavoriteIcon className="red-colored" />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Comments" arrow>
                      <IconButton
                        onClick={() => {
                          setOpenCommentsDialog(true);
                          setCurrPostLikesClick(postDetails);
                        }}
                      >
                        <ChatBubbleOutlineIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Share" arrow>
                      <IconButton>
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <Button
                    onClick={() => {
                      setOpenLikesDialog(true);
                      setCurrPostLikesClick(postDetails);
                    }}
                    className="like-count-p"
                    variant="light"
                  >
                    <p className="like-count-p">
                      {postDetails?.likeCount} Likes
                    </p>
                  </Button>
                </div>
              </div>
            </SwiperSlide>
          )
        )}
      </Swiper>
      <ToastContainer />
    </>
  );
};

export default Home;
