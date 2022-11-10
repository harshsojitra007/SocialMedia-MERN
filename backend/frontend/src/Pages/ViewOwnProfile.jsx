import React, { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  useFriendShipStatusMutation,
  useGetMutualCountMutation,
  useAddFriendMutation,
  useRemoveFriendMutation,
  useCancelFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useDeleteFriendRequestMutation,
  useFetchUsersPostsMutation,
} from "../services/appApi";
import { useNavigate } from "react-router-dom";
import "../styles/ViewProfile.css";

const ViewOwnProfile = (props) => {
  const user = useMemo(() => JSON.parse(sessionStorage.getItem("user")), []);
  const [friendShipStatus] = useFriendShipStatusMutation(),
    [getMutualCount] = useGetMutualCountMutation();
  const [addFriendFunc] = useAddFriendMutation();
  const [removeFriendFunc] = useRemoveFriendMutation();
  const [cancelFriendRequest] = useCancelFriendRequestMutation();
  const [acceptFriendRequest] = useAcceptFriendRequestMutation();
  const [deleteFriendRequest] = useDeleteFriendRequestMutation();
  const [usersPostFetch] = useFetchUsersPostsMutation();
  const [followText, setFollowText] = useState("No Relation");
  const [mutualCount, setMutualCount] = useState(0);
  const [postStatus, setPostStatus] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById("full-profile-outer").style.display = "none";
    document.getElementById("loading-spinner").style.display = "flex";

    friendShipStatus({ user, reqUser: props?.requestedUser }).then(
      async ({ data, error }) => {
        if (data) setFollowText(data);
        else
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
    );
    getMutualCount({ currUser: user, reqUser: props?.requestedUser }).then(
      async ({ data, error }) => {
        if (data) setMutualCount(data?.mutualCount);
        else
          toast.error(error.data, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
      }
    );

    const requestedUser = props?.requestedUser?.name;
    usersPostFetch({ user: requestedUser }).then(async ({ data, error }) => {
      if (data) {
        setPostStatus(data);
        setPostCount(data?.length);
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
    document.getElementById("loading-spinner").style.display = "none";
    document.getElementById("full-profile-outer").style.display = "flex";
  }, [
    friendShipStatus,
    getMutualCount,
    user,
    usersPostFetch,
    props?.requestedUser,
  ]);

  return (
    <>
      <div id="full-profile-outer" className="full-profile-outer">
        <div id="user-profile-outer" className="user-profile-outer">
          <div className="user-profile">
            <div className="user-image-div">
              <img
                id="user-profile-image"
                src={props?.requestedUser?.picture}
                alt="user-pic"
              />
            </div>

            <div className="user-overall-content">
              <div className="user-action-options">
                <div className="user-name">{props?.requestedUser?.name}</div>
                {user?.name === props?.requestedUser?.name && (
                  <button
                    onClick={() => {
                      navigate(`/edit?profile=${user?.name}`);
                    }}
                    className="btn btn-primary view-button"
                  >
                    Edit Profile
                  </button>
                )}
                {user?.name !== props?.requestedUser?.name &&
                  followText === "No Relation" && (
                    <button
                      onClick={async () => {
                        await addFriendFunc({
                          user,
                          reqForFriend: props?.requestedUser,
                        }).then(({ data, error }) => {
                          if (data) {
                            toast.success(data, {
                              position: "top-right",
                              autoClose: 1500,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                            });
                            setFollowText("Friend Request Sent");
                          } else {
                            toast.error(error.data, {
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
                      }}
                      className={`btn btn-success add-button`}
                    >
                      Add Friend
                    </button>
                  )}
                {user?.name !== props?.requestedUser?.name &&
                  followText === "Already Friends" && (
                    <button
                      onClick={async () => {
                        await removeFriendFunc({
                          user,
                          friend: props?.requestedUser,
                        }).then(({ data, error }) => {
                          if (data) {
                            toast.error(data, {
                              position: "top-right",
                              autoClose: 1500,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                            });
                            setFollowText("No Relation");
                          } else {
                            toast.error(error.data, {
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
                      }}
                      className={`btn btn-danger logout-button`}
                    >
                      Remove Friend
                    </button>
                  )}
                {user?.name !== props?.requestedUser?.name &&
                  followText === "Friend Request Sent" && (
                    <button
                      onClick={async () => {
                        await cancelFriendRequest({
                          currUser: user,
                          requestedUser: props?.requestedUser,
                        }).then(({ data, error }) => {
                          if (data) {
                            toast.warn(data, {
                              position: "top-right",
                              autoClose: 1500,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                            });
                            setFollowText("No Relation");
                          } else {
                            toast.error(error.data, {
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
                      }}
                      className={`btn btn-danger logout-button`}
                    >
                      Cancel Request
                    </button>
                  )}
                {user?.name !== props?.requestedUser?.name &&
                  followText === "Friend Request Incomed" && (
                    <div className="income-action-buttons">
                      <button
                        onClick={async () => {
                          await acceptFriendRequest({
                            currUser: user,
                            requestedUser: props?.requestedUser,
                          }).then(({ data, error }) => {
                            if (data) {
                              toast.success(data, {
                                position: "top-right",
                                autoClose: 1500,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                              });
                              setFollowText("Already Friends");
                            } else {
                              toast.error(error.data, {
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
                        }}
                        className={`btn btn-success add-button`}
                      >
                        Accept
                      </button>
                      <button
                        onClick={async () => {
                          await deleteFriendRequest({
                            currUser: user,
                            requestedUser: props?.requestedUser,
                          }).then(({ data, error }) => {
                            if (data) {
                              toast.warn(data, {
                                position: "top-right",
                                autoClose: 1500,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                              });
                              setFollowText("No Relation");
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
                        }}
                        className={`btn btn-danger logout-button`}
                      >
                        Decline
                      </button>
                    </div>
                  )}
              </div>
              <div className="user-general-info">
                <div className="post-related-info">
                  <p className="post-count">{postCount}</p>
                  <p className="post-title">posts</p>
                </div>
                {user?.name === props?.requestedUser?.name && (
                  <div className="friends-info">
                    <p className="friends-count">{user?.friends?.length}</p>
                    <p className="user-friends-title">friends</p>
                  </div>
                )}

                {user?.name !== props?.requestedUser?.name && (
                  <div className="mutual-connection-info">
                    <p className="mutual-count">{mutualCount}</p>
                    <p className="mutual-title">mutual friends</p>
                  </div>
                )}
              </div>
              <div className="user-bio">{props?.requestedUser?.bio}</div>
            </div>
          </div>
          <div className="user-posts">
            <div className="user-posts-inner">
              {postStatus?.map((currPost) => (
                <img
                  alt="users-post"
                  onClick={() => {
                    navigate(`/view/post?sharingId=${currPost._id}`);
                  }}
                  key={currPost._id}
                  src={currPost.postPicture}
                  id="user-profile-post-cover"
                />
              ))}
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default ViewOwnProfile;
