import React from "react";
import { useState } from "react";
import {
  useSignUpUserMutation,
  useFetchUsernamesMutation,
} from "../services/appApi";
import { useNavigate } from "react-router-dom";
import "../styles/signup.css";

const Signup = () => {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [name, setName] = useState(""),
    [errorInName, setErrorInName] = useState(""),
    [isDisable, setIsDisable] = useState(false);

  const [signUpUser] = useSignUpUserMutation();
  const [fetchUserNames] = useFetchUsernamesMutation();
  const navigate = useNavigate();

  const [InvalidMessage, setInvalidMessage] = useState(""),
    [InvalidMessageClass, setInvalidMessageClass] = useState(""),
    [userList, setUserList] = useState([]),
    [submitTrack, setSubmitTrack] = useState(false);

  async function validateUserName(name) {
    const specialChars = /[`!@#$%^&*()+\-=[\]{};':"\\|,<>/?~]/;
    if (name.indexOf(" ") !== -1) {
      setIsDisable(true);
      setErrorInName("Name can not contain spaces");
    } else if (specialChars.test(name)) {
      setIsDisable(true);
      setErrorInName("Name can not contain special characters");
    } else if (name.length > 30) {
      setIsDisable(true);
      setErrorInName("Name must not exceed 30 characters");
    } else {
      fetchUserNames().then(({ data, error }) => {
        if (error) {
          setIsDisable(true);
          setInvalidMessage(error.data);
          setInvalidMessageClass(
            "d-flex justify-content-center align-items-center alert alert-danger"
          );
        }else{
          setUserList(data);
        }
      });

      let isUserNameAvail = true;
      if (userList.indexOf(name) !== -1) isUserNameAvail = false;

      if (!isUserNameAvail) {
        setIsDisable(true);
        setErrorInName("username is not available");
      } else {
        setIsDisable(false);
        setErrorInName("");
      }
    }
  }

  // To Signup new user
  async function handleSignup(e) {
    setSubmitTrack(true);
    e.preventDefault();

    try {
      setIsDisable(true);
      signUpUser({ name, email, password }).then(({ data, error }) => {
        if (data) {
          navigate("/SuccessPage");
        } else {
          setIsDisable(false);
          setInvalidMessage(error.data);
          setInvalidMessageClass(
            "d-flex justify-content-center align-items-center alert alert-danger"
          );
        }
      });
    } catch (error) {
      setIsDisable(true);
      setInvalidMessage(error.error);
      setInvalidMessageClass(
        "d-flex justify-content-center align-items-center alert alert-danger"
      );
    }
    setSubmitTrack(false);
  }

  return (
    <div className="signup-main-outer">
      <div className="signup-form">
        <form onSubmit={handleSignup}>
          <h1 className="d-flex justify-content-center">Create Account</h1>
          <span style={{ margin: "1rem" }} className={InvalidMessageClass}>
            {InvalidMessage}
          </span>

          <div className="form-group">
            <label className="input-label" htmlFor="userName">
              Display Name
            </label>
            <input
              type="text"
              className="form-control"
              id="userName"
              name="userName"
              placeholder="Enter Your Name"
              required
              onChange={(e) => {
                setName(e.target.value.toLowerCase());
                validateUserName(e.target.value.toLowerCase());
              }}
              autoComplete="off"
              value={name}
            />
            <small className="form-text text-muted">{errorInName}</small>
          </div>
          <div className="form-group">
            <label className="input-label" htmlFor="userEmail">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="userEmail"
              name="userEmail"
              placeholder="Enter email"
              autoComplete="off"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <small id="emailHelp" className="form-text text-muted">
              We'll never share your email with anyone else
            </small>
          </div>
          <div className="form-group">
            <label className="input-label" htmlFor="userPassword">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="userPassword"
              name="userPassword"
              placeholder="Password"
              required
              onChange={(e) => {
                const specialChars = /[`!@#$%^&*_()+\-=[\]{};':"\\|,.<>/?~]/;
                if (
                  !specialChars.test(e.target.value) ||
                  e.target.value.length < 8
                )
                  setIsDisable(true);
                else setIsDisable(false);

                setPassword(e.target.value);
              }}
              value={password}
            />
            <small className="form-text text-muted">
              Password must be of 8 characters & contain special characters
            </small>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="privacy-policy-check-box"
              required
            />
            <label
              className="form-check-label"
              htmlFor="privacy-policy-check-box"
            >
              <a className="link" href="/privacy_policy">
                Terms & Conditions
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary submit-button"
            disabled={isDisable}
          >
            {submitTrack ? "Signing in..." : "Sign Up"}
          </button>

          <div className="py-4">
            <p className="text-center">
              Already have an Account?{" "}
              <button onClick={ () => { navigate("/login"); } } className="btn btn-light link">
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
