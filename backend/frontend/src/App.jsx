import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/home";
import Login from "./Pages/login";
import Signup from "./Pages/signup";
import Chat from "./Pages/chat";
import AllUsers from "./Components/AllUsers";
import PendingRequests from "./Components/PendingRequests";
import RequestSent from "./Components/RequestSent";

import NavBar from "./Components/NewNavMenu";

import CreatePost from "./Components/CreatePost";
import SuccessPage from "./Pages/SuccessPage";
import ViewProfile from "./Pages/ViewProfile";
import { useState } from "react";
import { AppContext } from "./context/appContext";
import "bootstrap/dist/css/bootstrap.min.css";
import ViewPost from "./Components/ViewPost";
import EditProfile from "./Pages/EditProfile";

function App() {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));
  const [friends, setFriends] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [requestSent, setRequestSent] = useState([]);
  const [messages, setMessages] = useState([]);

  window.addEventListener("storage", function () {
    setUser(JSON.parse(this.sessionStorage.getItem("user")));
  }, false);

  return (
    <AppContext.Provider value={{ friends, setFriends, allUsers, setAllUsers, pendingRequests, setPendingRequests, requestSent, setRequestSent, messages, setMessages }}>
      <BrowserRouter>
        <NavBar />
        <Routes>
          {/* Contains all necessary routing info. for the Frontend part for Logged-in as well as Not Logged in user */}
          <Route path="/" element={<Home />} />

          {user && <Route path="/login" element={<Home />} />}
          {!user && <Route path="/login" element={<Login />} />}

          {user && <Route path="/signup" element={<Home />} />}
          {!user && <Route path="/signup" element={<Signup />} />}

          {user && <Route path="/PendingRequests" element={<PendingRequests />} />}
          {!user && <Route path="/PendingRequests" element={<Login />} />}

          {user && <Route path="/RequestSent" element={<RequestSent />} />}
          {!user && <Route path="/RequestSent" element={<Login />} />}

          {user && <Route path="/chat" element={<Chat />} />}
          {!user && <Route path="/chat" element={<Login />} />}

          {user && <Route path="/CreatePost" element={<CreatePost />} />}
          {!user && <Route path="/CreatePost" element={<Login />} />}

          {user && <Route path="/AllUsers" element={<AllUsers />} /> }
          {!user && <Route path="/AllUsers" element={<Login />} /> }

          <Route path="/SuccessPage" element={<SuccessPage />} />

          <Route path="/edit" element={<EditProfile />} />
          <Route path="/view/post" element={<ViewPost />} />
          <Route path="/view" element={<ViewProfile />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;