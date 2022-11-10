import React, { useContext, useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import { ToastContainer, toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import ReactLoading from "react-loading";
import {
  useFetchPendingRequestMutation,
  useAcceptFriendRequestMutation,
  useDeleteFriendRequestMutation,
} from "../services/appApi";

import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/navigation";
import "../styles/PendingRequests.css";
import NoUserFound from "./NoUserFound";
import { useNavigate } from "react-router-dom";

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

const PendingRequests = () => {
  const user = useMemo(() => JSON.parse(sessionStorage.getItem("user")), []);
  // const user = useSelector((state) => state.user);
  const [pendingRequestFunc] = useFetchPendingRequestMutation(),
    [acceptRequestFunc] = useAcceptFriendRequestMutation(),
    [deleteRequestFunc] = useDeleteFriendRequestMutation();
  const [currDisable, setCurrDisable] = useState(null);
  const { pendingRequests, setPendingRequests } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById("pending-request-page").style.display = "none";
    pendingRequestFunc({ user }).then(async ({ data, error }) => {
      await setPendingRequests(data);
      document.getElementById("loading-spinner").style.display = "none";
      document.getElementById("pending-request-page").style.display = "";
    });
  }, [user, setPendingRequests, pendingRequestFunc]);
    
  async function search(e) {
    await pendingRequestFunc({ user }).then(async ({ data, error }) => {
      if (data) {
        const newResults = [];
        for (let currFriend of data) {
          if (currFriend?.name?.includes(e, 0) === true)
            newResults.push(currFriend);
        }
        await setPendingRequests(newResults);
      }
    });
  }

  function refresh() {
    // window.location.reload(false);
    navigate("/PendingRequests");
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
      <div id="pending-request-page" className="pending-request-page">
        <div className="title-and-search-bar">
          <h3 className="friends-title">Pending Requests</h3>
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

        <Swiper
          modules={[Navigation]}
          spaceBetween={50}
          navigation={true}
          draggable={true}
          className="show-users"
          speed={800}
        >
          {pendingRequests?.length === 0 ? (
            <SwiperSlide className="no-user-details">
              <NoUserFound />
            </SwiperSlide>
          ) : (
            ""
          )}
          {pendingRequests?.map((member) => (
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
                <div className="card-body pending-request-card">
                  <h4 className="single-user-name border-left">
                    <p>{member.name}</p>
                    {/* <span className="border-bottom"></span> */}
                  </h4>

                  {/* <div className="mutuals">3+ mutual friends</div> */}

                  <div className="action-buttons">
                    <button
                      disabled={member._id === currDisable}
                      className="btn btn-success accept-button"
                      onClick={async () => {
                        await acceptRequestFunc({
                          currUser: user,
                          requestedUser: member,
                        });
                        setCurrDisable(member?._id);
                        toast.success("Request Accepted", {
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
                      Accept Request
                    </button>

                    <button
                      disabled={member._id === currDisable}
                      className="btn btn-danger decline-button"
                      onClick={async () => {
                        await deleteRequestFunc({
                          currUser: user,
                          requestedUser: member,
                        });
                        setCurrDisable(member?._id);
                        toast.error("Request Declined", {
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
                      Decline Request
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <ToastContainer />
      </div>
    </>
  );
};

export default PendingRequests;
