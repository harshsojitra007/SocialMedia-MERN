import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import { IconButton, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  useLikeThePostMutation,
  useCommentOnPostMutation,
  useUserCurrentStateMutation,
  useFetchPostDetailsMutation,
} from "../services/appApi";
import Tooltip from "@mui/material/Tooltip";
import ReactLoading from "react-loading";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import NearMeIcon from "@mui/icons-material/NearMe";

import "../styles/home.css";
import { useMemo } from "react";

const ViewPost = () => {
  const user = useMemo(() => JSON.parse(sessionStorage.getItem("user")), []);
  const [searchParams] = useSearchParams();
  const [fetchUserDetails] = useUserCurrentStateMutation();
  const [fetchPostDetails] = useFetchPostDetailsMutation();
  const [likePost] = useLikeThePostMutation();
  const [postComment] = useCommentOnPostMutation();
  const navigate = useNavigate();

  const [showFullCaption, setShowFullCaption] = useState(false);
  const [openLikesDialog, setOpenLikesDialog] = useState(false);
  const [currPostLikesClick, setCurrPostLikesClick] = useState(null);
  const [openCommentsDialog, setOpenCommentsDialog] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [postDetails, setPostDetails] = useState(null);
  const [postOwnerDetails, setPostOwnerDetails] = useState(null);

  useEffect(() => {
    document.getElementById("loading-spinner").style.display = "flex";
    document.getElementById("requested-post-div").style.display = "none";

    const postId = searchParams.get("sharingId");
    fetchPostDetails({ id: postId }).then(async ({ data, error }) => {
      if (data) setPostDetails(data);
      else {
        toast.error(error?.data, {
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

    fetchUserDetails({ userName: postDetails?.postOwner }).then(
      ({ data, error }) => {
        if (data) setPostOwnerDetails(data);
        else {
          toast.error(error?.data, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        document.getElementById("loading-spinner").style.display = "none";
        document.getElementById("requested-post-div").style.display = "flex";
      }
    );

  }, [
    fetchPostDetails,
    fetchUserDetails,
    setPostOwnerDetails,
    setPostDetails,
    searchParams,
    postDetails?.postOwner
  ]);

  function verify(list) {
    if (!list) return false;

    for (const currUser of list) {
      if (currUser?.name === user?.name) return true;
    }
    return false;
  }

  async function likeAction(postDetails) {
    await likePost({ post: postDetails, user: user }).then(
      ({ data, error }) => {
        if (error) {
          toast.error(error?.data, {
            position: "top-right",
            autoClose: false,
            closeOnClick: true,
          });
        }else{
          setPostDetails(data);
        }
      }
    );
  }

  async function commentAction() {
    if (commentContent === "") return;

    await postComment({
      user,
      comment: commentContent,
      currPostDetails: currPostLikesClick,
    }).then(async ({ data, error }) => {
      if (error) {
        toast.error(error?.data, {
          position: "top-right",
          autoClose: false,
          closeOnClick: true,
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
      <div id="requested-post-div" className="show-users-posts">
        <div key={postDetails?._id} className="single-user-details">
          <div key={postDetails?._id} className="card curr-post-div">
            <div style={{cursor: "pointer"}} onClick={() => { navigate(`/view?user=${postOwnerDetails?.name}`); }} className="data-of-user">
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
                    postDetails?.caption?.split("\n")?.map((item, index) => (
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
                <p className="like-count-p">{postDetails?.likeCount} Likes</p>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ViewPost;
