import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { useLogoutUserMutation } from "../services/appApi";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import RestoreRoundedIcon from "@mui/icons-material/RestoreRounded";
import ScheduleSendRoundedIcon from "@mui/icons-material/ScheduleSendRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import AppRegistrationRoundedIcon from "@mui/icons-material/AppRegistrationRounded";

import "../styles/Nav.css";
import { LinkContainer } from "react-router-bootstrap";
import { Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const [user, setUser] = React.useState(JSON.parse(sessionStorage.getItem("user")));
  const [logoutUser] = useLogoutUserMutation();
  // const [fetchCurrentStateFunc] = useUserCurrentStateMutation();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  window.addEventListener("storage", function () {
    setUser(JSON.parse(this.sessionStorage.getItem("user")));
  }, false);

  async function handleLogout(e) {
    e.preventDefault();
    await logoutUser({name: user?.name});
    sessionStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Tooltip title="RxChat" arrow>
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontSize: "larger",
                fontFamily: "poppins",
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              RxChat
            </Typography>
          </Tooltip>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <LinkContainer to="/">
                <Nav.Link>
                  <Tooltip title="Home" arrow>
                    <Button id="new-nav-button blue">
                      <HomeRoundedIcon />
                      <p id="m-lr-7">Home</p>
                    </Button>
                  </Tooltip>
                </Nav.Link>
              </LinkContainer>

              {!user && (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <Tooltip title="Login" arrow>
                      <Button id="new-nav-button blue">
                        <LoginRoundedIcon />
                        <p id="m-lr-7">Login</p>
                      </Button>
                    </Tooltip>
                  </Nav.Link>
                </LinkContainer>
              )}

              {!user && (
                <LinkContainer to="/signup">
                  <Nav.Link>
                    <Tooltip title="Sign Up" arrow>
                      <Button id="new-nav-button blue">
                        <AppRegistrationRoundedIcon />
                        <p id="m-lr-7">Sign Up</p>
                      </Button>
                    </Tooltip>
                  </Nav.Link>
                </LinkContainer>
              )}

              {user && (
                <LinkContainer to="/Chat">
                  <Nav.Link>
                    <Tooltip title="Chat" arrow>
                      <Button id="new-nav-button blue">
                        <ChatBubbleRoundedIcon />
                        <p id="m-lr-7">Chat</p>
                      </Button>
                    </Tooltip>
                  </Nav.Link>
                </LinkContainer>
              )}

              {user && (
                <LinkContainer to="/CreatePost">
                  <Nav.Link>
                    <Tooltip title="Create New Post" arrow>
                      <Button id="new-nav-button blue">
                        <AddCircleOutlineRoundedIcon />
                        <p id="m-lr-7">Post</p>
                      </Button>
                    </Tooltip>
                  </Nav.Link>
                </LinkContainer>
              )}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            sx={{
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "poppins",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            RxChat
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <LinkContainer to="/">
              <Nav.Link>
                <Tooltip title="Home" arrow>
                  <Button id="new-nav-button">
                    <HomeRoundedIcon color="white" />
                    <p id="m-lr-7">Home</p>
                  </Button>
                </Tooltip>
              </Nav.Link>
            </LinkContainer>

            {!user && (
              <LinkContainer to="/login">
                <Nav.Link>
                  <Tooltip title="Login" arrow>
                    <Button id="new-nav-button">
                      <LoginRoundedIcon />
                      <p id="m-lr-7">Login</p>
                    </Button>
                  </Tooltip>
                </Nav.Link>
              </LinkContainer>
            )}

            {!user && (
              <LinkContainer to="/signup">
                <Nav.Link>
                  <Tooltip title="Sign Up" arrow>
                    <Button id="new-nav-button">
                      <AppRegistrationRoundedIcon />
                      <p id="m-lr-7">Sign Up</p>
                    </Button>
                  </Tooltip>
                </Nav.Link>
              </LinkContainer>
            )}

            {user && (
              <LinkContainer to="/Chat">
                <Nav.Link>
                  <Tooltip title="Chat" arrow>
                    <Button id="new-nav-button">
                      <ChatBubbleRoundedIcon color="white" />
                      <p id="m-lr-7">Chat</p>
                    </Button>
                  </Tooltip>
                </Nav.Link>
              </LinkContainer>
            )}

            {user && (
              <LinkContainer to="/CreatePost">
                <Nav.Link>
                  <Tooltip title="Create New Post" arrow>
                    <Button id="new-nav-button">
                      <AddCircleOutlineRoundedIcon color="white" />
                      <p id="m-lr-7">Post</p>
                    </Button>
                  </Tooltip>
                </Nav.Link>
              </LinkContainer>
            )}
          </Box>

          {user && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="User Profile" arrow>
                <Button onClick={handleOpenUserMenu} id="new-nav-button">
                  <div sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp" className="nav-menu-user-picture" src={user?.picture} />
                  </div>
                  <p id="m-lr-7">{user?.name}</p>
                </Button>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <LinkContainer to="/AllUsers">
                  <Nav.Link>
                    <Tooltip title="Add New Friends" arrow>
                      <Button id="new-nav-button blue">
                        <PersonAddAlt1RoundedIcon />
                        <p id="m-lr-7">Add Friends</p>
                      </Button>
                    </Tooltip>
                  </Nav.Link>
                </LinkContainer>

                <LinkContainer to="/PendingRequests">
                  <Nav.Link>
                    <Tooltip title="Pending Requests" arrow>
                      <Button id="new-nav-button blue">
                        <RestoreRoundedIcon />
                        <p id="m-lr-7">Pending Requests</p>
                      </Button>
                    </Tooltip>
                  </Nav.Link>
                </LinkContainer>

                <LinkContainer to="/RequestSent">
                  <Nav.Link>
                    <Tooltip title="Request Sent" arrow>
                      <Button id="new-nav-button blue">
                        <ScheduleSendRoundedIcon />
                        <p id="m-lr-7">Request Sent</p>
                      </Button>
                    </Tooltip>
                  </Nav.Link>
                </LinkContainer>

                <LinkContainer to={`/view?user=${user?.name}`}>
                  <Nav.Link>
                    <Tooltip title="View Profile" arrow>
                      <Button id="new-nav-button blue">
                        <PersonRoundedIcon />
                        <p id="m-lr-7">View Profile</p>
                      </Button>
                    </Tooltip>
                  </Nav.Link>
                </LinkContainer>

                <Tooltip title="Logout" arrow>
                  <Button
                    onClick={handleLogout}
                    style={{ display: "flex", margin: "0 auto" }}
                    id="new-nav-button blue"
                  >
                    <LogoutRoundedIcon />
                    <p id="m-lr-7">Logout</p>
                  </Button>
                </Tooltip>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
