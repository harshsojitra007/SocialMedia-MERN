import { React, useState } from "react";
// import { useSelector } from "react-redux";
import { IoMdCloudUpload } from "react-icons/io";
import { usePostNewPictureMutation } from "../services/appApi";
import { useNavigate } from "react-router-dom";

import "../styles/CreatePost.css";
import { useEffect } from "react";
import { useMemo } from "react";

const CreatePost = () => {
  const user = useMemo(() => JSON.parse(sessionStorage.getItem("user")), []);
  // const user = useSelector((state) => state.user);
  const [postNewPicture] = usePostNewPictureMutation();
  const navigator = useNavigate();

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null),
    [caption, setCaption] = useState("");
  const [InvalidMessage, setInvalidMessage] = useState(""),
    [InvalidMessageClass, setInvalidMessageClass] = useState("");
  const [disabler, setDisabler] = useState(false);

  useEffect(() => {
    document.getElementById("finishing").style.display = "none";
  }, []);

  async function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();

    month = month.length > 1 ? month : "0" + month;
    day = day.length > 1 ? day : "0" + day;

    return month + "/" + day + "/" + year;
  }

  function setImageFunc(e) {
    e.preventDefault();

    const imgFile = e.target.files[0];
    setImage(imgFile);
    setImagePreview(URL.createObjectURL(imgFile));
  }

  async function handlePostImage() {
    setDisabler(true);

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "post_uploader_preset");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dhdhpzhtq/image/upload",
        {
          method: "post",
          body: formData,
        }
      );
      let urlData = await response.json();
      urlData = urlData?.url;
      const todayDate = await getFormattedDate();
      
      await postNewPicture({ user, todayDate, urlData, caption }).then(
        ({ data, error }) => {
          if (error) {
            setInvalidMessage("Error Occurred while posting");
            setInvalidMessageClass(
              "d-flex justify-content-center align-items-center alert alert-danger"
            );
          }
          if (data) navigator("/");
        }
      );
    } catch (ex) {
      setInvalidMessage("Error Occurred while posting");
      setInvalidMessageClass(
        "d-flex justify-content-center align-items-center alert alert-danger"
      );
    }
  }

  function processNext() {
    document.getElementById("post-pic-div").style.display = "none";
    document.getElementById("finishing").style.display = "flex";
    document.getElementById("finishing").style.flexDirection = "column";
    document.getElementById("finishing").style.height = "fit-content";
    document.getElementById("finishing").style.overflow = "hidden";
    document.getElementById("finishing").style.margin = "3rem auto";
    document.getElementById("finishing").style.border = "1.6px solid #89cff0";
    document.getElementById("finishing").style.borderRadius = ".7rem";
    document.getElementById("finishing").style.background = "lightcyan";
  }

  function processBack() {
    document.getElementById("post-pic-div").style.display = "flex";
    document.getElementById("finishing").style.display = "none";
  }

  return (
    <div className="post-container">
      <div className="post-outer">
        <h4 className="title">Create New Post</h4>

        <span style={{ margin: "1rem" }} className={InvalidMessageClass}>
          {InvalidMessage}
        </span>

        <div id="post-pic-div" className="card div-of-pic">
          {imagePreview ? (
            <img
              id="post-pic"
              className="post-pic"
              src={imagePreview}
              alt="post-preview"
            />
          ) : (
            <div className="upload-icon-div">
              <IoMdCloudUpload className="upload-image-icon" />
            </div>
          )}
          <input
            type="file"
            id="post-image-uploader"
            hidden
            accept="image/jpg, image/png, image/jpeg"
            onChange={setImageFunc}
          />
          <div className="card-body">
            <div className="action-buttons">
              <label
                htmlFor="post-image-uploader"
                className="btn btn-success add-button"
              >
                Upload Image
              </label>

              <button
                disabled={imagePreview ? false : true}
                className="btn btn-primary view-button"
                onClick={processNext}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div id="finishing" className="card finishing">
          <div className="data-of-user">
            <img
              src={user.picture}
              className="post-owner-pic"
              id="post-owner-pic"
              alt="user-pic"
            />
            <div className="username-location">
              <p className="user-name-post">{user?.name}</p>
              <p className="location">location</p>
            </div>
          </div>
          <img className="post-pic" src={imagePreview} alt="post-pic-preview" />
          <div className="card-body">
            <div className="caption-div">
              <textarea
                id="post-caption"
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your caption here..."
                value={caption}
                rows="1"
                maxLength="1000"
              />
            </div>
            <div className="finish-buttons">
              <button
                onClick={processBack}
                className="btn btn-info back-button-info"
                disabled={disabler}
              >
                Go Back
              </button>
              <button
                onClick={handlePostImage}
                className="btn btn-success accept-button"
                disabled={disabler}
              >
                {disabler ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
