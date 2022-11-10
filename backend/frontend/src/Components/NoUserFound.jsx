import React from "react";
import { FiUserX } from "react-icons/fi";
import { toast } from "react-toastify";

const NoUserFound = () => {
  async function copyLink() {
    navigator.clipboard.writeText("http://localhost:3000/");
  }
  return (
    <div className="card no-user-card">
      <FiUserX className="no-user-found-icon" />
      <div className="card-body">
        <h4 className="no-user-found-text">
          <p>No User Found</p>
          <small className="invite-friends">
            Invite your friends now & have fun, copy the below link
          </small>
          <button
            onClick={async () => {
              await copyLink();
              toast.success("Copied to clipboard", {
                position: "top-right",
                autoClose: 2000,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
              });
            }}
            className="btn btn-success accept-button"
          >
            copy link
          </button>
        </h4>
      </div>
    </div>
  );
};

export default NoUserFound;
