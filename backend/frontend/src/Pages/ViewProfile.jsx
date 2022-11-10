import React, { useState, useEffect, useMemo } from "react";
// import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useUserCurrentStateMutation } from "../services/appApi";
import ReactLoading from "react-loading";
import ViewOwnProfile from "./ViewOwnProfile";
import "../styles/ViewProfile.css";

const ViewProfile = () => {
  const user = useMemo(() => JSON.parse(sessionStorage.getItem("user")), []);
  // const user = useSelector((state) => state.user);
  const [fetchCurrentState] = useUserCurrentStateMutation();
  const [searchParams] = useSearchParams();
  const [currUser, setCurrUser] = useState(null);

  useEffect(() => {
    document.getElementById("loading-spinner").style.display = "";
    document.getElementById("view-profile-outer").style.display = "none";

    const userName = searchParams.get("user");
    fetchCurrentState({ userName }).then(async ({ data, error }) => {
      if (data) {
        setCurrUser(data);
        document.getElementById("view-profile-outer").style.display = "none";
      } else {
        document.getElementById("view-profile-outer").style.display = "";
      }
      document.getElementById("loading-spinner").style.display = "none";
    });
  }, [searchParams, fetchCurrentState]);

  return (
    <>
      <ReactLoading
        type="spinningBubbles"
        color="#1261a0"
        id="loading-spinner"
        className="loading-spinner"
      />

      <div id="view-profile-outer">
        {!currUser && (
          <div className="success-page-container">
            <div className="card success-page-card">
              <div className="card-body success-page-card-body">
                <p className="success-page-content">Requested User Not Found</p>
              </div>
            </div>
          </div>
        )}
      </div>
      {!!currUser && (
        <ViewOwnProfile currUser={user} requestedUser={currUser} />
      )}
    </>
  );
};

export default ViewProfile;
