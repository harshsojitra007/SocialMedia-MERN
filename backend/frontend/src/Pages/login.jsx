import React, { useState } from "react";
import { useLoginUserMutation } from '../services/appApi';
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
    
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loginUser] = useLoginUserMutation();
  const [loginStatus, setLoginStatus] = useState("Login");
  const [InvalidMessage, setInvalidMessage] = useState("");
  const [InvalidMessageClass, setInvalidMessageClass] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e){
    e.preventDefault();
    setLoginStatus("Logging in...");

    loginUser({userName, password}).then(({data, error}) => {
      if(data){
        sessionStorage.setItem("user", JSON.stringify(data));
        window.dispatchEvent(new Event("storage"));
        navigate("/");
      }else{
        setInvalidMessage(error.data);
        setInvalidMessageClass("d-flex justify-content-center align-items-center alert alert-danger");
        setLoginStatus("Login");
      }
    });
  }

  return (
    <div className="login-main-outer">
      <div className="login-form">
        <form onSubmit={handleLogin}>
          <h1 className="d-flex justify-content-center align-items-center" style={{fontFamily: 'Poppins'}}>Login</h1>
          <span style={{margin: '1rem'}} className={InvalidMessageClass}>{InvalidMessage}</span>
          <div className="form-group">
            <label className="input-label" htmlFor="exampleInputEmail1">
              username
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter username"

              required
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
            />
          </div>
          <div className="form-group">
            <label className="input-label" htmlFor="exampleInputPassword1">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Password"

              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <button type="submit" className="btn btn-primary submit-button">
            {loginStatus}
          </button>

          <div className="py-4">
            <p className="text-center">
              Don't have an Account?{" "}
              <button onClick={ () => { navigate("/signup"); } } className="btn btn-light link">
                Sign Up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
