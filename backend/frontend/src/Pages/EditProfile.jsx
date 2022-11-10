import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  useFetchUsernamesMutation,
  useUpdateProfileMutation,
  useUserCurrentStateMutation,
} from "../services/appApi";

import CachedIcon from "@mui/icons-material/Cached";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CancelIcon from "@mui/icons-material/Cancel";

import "../styles/EditProfile.css";
import { TextField, Tooltip } from "@mui/material";
import { useMemo } from "react";

const EditProfile = () => {
  const user = useMemo(() => JSON.parse(sessionStorage.getItem("user")), []);
  const navigate = useNavigate();
  const [currUser, setCurrUser] = useState(user);
  const [inValidUserName, setInValidUserName] = useState(false);
  const [displayBuffering, setDisplayBuffering] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [fetchUserNames] = useFetchUsernamesMutation();
  const [updateProfileFunc] = useUpdateProfileMutation();
  const [fetchCurrentUserState] = useUserCurrentStateMutation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const requestId = searchParams.get("profile");
    if(requestId !== user.name){
      navigate(`/view?user=${requestId}`);
    }
    fetchCurrentUserState({ userName: user.name }).then(({ data, error }) => {
      if (data) {
        setCurrUser(data);
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
  }, [fetchCurrentUserState, user, navigate, searchParams]);

  const [imagePreview, setImagePreview] = useState(currUser.picture);
  const [userImage, setUserImage] = useState(null);
  const [userName, setUserName] = useState(currUser.name);
  const [userBio, setUserBio] = useState(currUser.bio);

  async function validateUserName(name) {
    setDisplayBuffering(true);
    const specialChars = /[`!@#$%^&*()+\-=[\]{};':"\\|,<>/?~]/;

    if (name.indexOf(" ") !== -1) {
      setIsDisable(true);
      setInValidUserName(true);
      setDisplayBuffering(false);
    } else if (specialChars.test(name)) {
      setIsDisable(true);
      setInValidUserName(true);
      setDisplayBuffering(false);
    } else if (name.length > 30) {
      setIsDisable(true);
      setInValidUserName(true);
      setDisplayBuffering(false);
    } else if (name.length === 0) {
      setIsDisable(true);
      setInValidUserName(true);
      setDisplayBuffering(false);
    } else {
      fetchUserNames().then(({ data, error }) => {
        if (error) {
          setIsDisable(true);
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
          let isUserNameAvail = true;
          if (name !== user.name && data.indexOf(name) !== -1)
            isUserNameAvail = false;

          if (!isUserNameAvail) {
            setIsDisable(true);
            setInValidUserName(true);
            setDisplayBuffering(false);
          } else {
            setIsDisable(false);
            setInValidUserName(false);
            setDisplayBuffering(false);
          }
        }
      });
    }
  }

  async function updateProfile() {
    try {
      let pictureUrl = currUser.picture;
      if (userImage !== null) {
        const data = new FormData();
        data.append("file", userImage);
        data.append("upload_preset", "post_uploader_preset");

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dhdhpzhtq/image/upload",
          {
            method: "post",
            body: data,
          }
        );

        pictureUrl = await response.json();
        pictureUrl = pictureUrl?.url;
      }

      await updateProfileFunc({
        userPicture: pictureUrl,
        userName: userName,
        userBio: userBio,
        userDetails: currUser,
      }).then(async ({ data, error }) => {
        if (data) {
          sessionStorage.setItem("user", JSON.stringify(data));
          window.dispatchEvent(new Event("storage"));
          toast.success("Profile Updated Successfully", {
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
        setTimeout(() => {
          navigate(`/view?user=${user.name}`);
        }, 2000);
      });
    } catch (err) {
      toast.error(err, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  return (
    <>
      <div className="edit-profile-outer">
        <div className="edit-profile-inner">
          <div className="new-user-image-div">
            <img id="new-image" src={imagePreview} alt="new-user-pic" />
            <Tooltip title="select image" arrow>
              <label htmlFor="new-image-input" className="new-image-input-icon">
                <i className="fa-solid fa-circle-plus i-green" />
              </label>
            </Tooltip>
            <input
              onChange={(e) => {
                setUserImage(e.target.files[0]);
                setImagePreview(URL.createObjectURL(e.target.files[0]));
              }}
              id="new-image-input"
              type="file"
              accept="image/*"
              hidden
            />
          </div>

          <div className="input-div-outer">
            <div className="new-user-name-input">
              <TextField
                id="user-new-bio-input"
                label="Username"
                value={userName}
                onChange={async (e) => {
                  setUserName(e.target.value);
                  await validateUserName(e.target.value);
                }}
                multiline
                variant="outlined"
                disabled
              />
              {inValidUserName === false && displayBuffering === true && (
                <Tooltip title="Validating..." arrow>
                  <CachedIcon id="user-name-input-status-icon" />
                </Tooltip>
              )}
              {inValidUserName === false && displayBuffering === false && (
                <Tooltip title="Username is valid" arrow>
                  <TaskAltIcon id="user-name-input-status-icon" />
                </Tooltip>
              )}
              {inValidUserName && (
                <Tooltip title="Invalid UserName" arrow>
                  <CancelIcon id="invalid-user-name-input-status-icon" />
                </Tooltip>
              )}
            </div>
            <TextField
              id="user-new-bio-input"
              label="Bio (Max 256 characters allowed)"
              placeholder="Enter your bio here..."
              value={userBio}
              onChange={(e) => {
                if (e.target.value.length <= 256) setUserBio(e.target.value);
              }}
              multiline
              maxRows={3}
              variant="outlined"
            />
            <button
              onClick={async () => {
                setIsDisable(true);
                await updateProfile();
              }}
              disabled={isDisable || userName.length === 0}
              className="btn btn-primary view-button"
            >
              Update
            </button>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default EditProfile;
