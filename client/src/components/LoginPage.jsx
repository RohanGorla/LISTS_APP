import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Login.css";

function Login({ callback, logout, setlogout, setuser }) {
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [currentUser, setCurrentUser] = useState();
  const [message, setMessage] = useState("");
  const [authorized, setAuthorized] = useState(false);

  function logOut() {
    setAuthorized(false);
    setMessage("");
    localStorage.removeItem("todo-auth");
    // sessionStorage.removeItem("session-auth");
    localStorage.removeItem("accessToken");
  }

  async function addUser() {
    await axios
      .post(`${import.meta.env.VITE_BASE_URL}/add`, {
        username: userName,
        password: password,
      })
      .then((res) => {
        if (res.data.status) {
          setMessage("");
          let local_auth_value = new Date().setDate(new Date().getDate() + 7);
          setAuthorized(true);
          localStorage.setItem("accessToken", res.data.row[0].token);
          localStorage.setItem("todo-auth", local_auth_value);
          callback(true);
          setuser(res.data.row[0]);
          setlogout(false);
        } else {
          setMessage(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        setMessage(
          "Server didn't respond. Try reloading the page to see if it works."
        );
      });
    setPassword("");
    setUserName("");
  }

  async function checkPassword() {
    await axios
      .post(`${import.meta.env.VITE_BASE_URL}/pass`, {
        password: password,
        username: userName,
      })
      .then((res) => {
        if (res.data.status) {
          setMessage("");
          setCurrentUser(res.data.row[0]);
          setuser(res.data.row[0]);
          let local_auth_value = new Date().setDate(new Date().getDate() + 7);
          setAuthorized(true);
          localStorage.setItem("accessToken", res.data.row[0].token);
          localStorage.setItem("todo-auth", local_auth_value);
          //   sessionStorage.setItem("session-auth", true);
          callback(true);
          setlogout(false);
        } else {
          setMessage(res.data.message);
          setAuthorized(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setMessage(
          "Server didn't respond. Try reloading the page to see if it works."
        );
      });
    setPassword("");
    setUserName("");
  }

  useEffect(() => {
    async function getUserinfo() {
      await axios
        .post(`${import.meta.env.VITE_BASE_URL}/get`, {
          token: localStorage.getItem("accessToken"),
        })
        .then((res) => {
          if (res.data.status) {
            setMessage("");
            setCurrentUser(res.data.data);
            setuser(res.data.data);
            callback(true);
          } else {
            setMessage(res.data.message);
            callback(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setMessage(
            "Server didn't respond. Try reloading the page to see if it works."
          );
        });
    }
    if (logout) {
      logOut();
    } else {
      let auth = localStorage.getItem("todo-auth");
      if (auth) {
        if (auth > new Date()) {
          setAuthorized(true);
          getUserinfo();
        } else {
          localStorage.removeItem("todo-auth");
          setAuthorized(false);
          callback(false);
        }
      }
    }
  }, []);

  return (
    <>
      <div className="login-container">
        <div className="login-box">
          <p className="error-message">{message}</p>
          <div className="email-input">
            <div>
              <label htmlFor="username">Username</label>
            </div>
            <input
              id="username"
              name="email"
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              value={userName}
              placeholder="Username..."
            ></input>
          </div>
          <div className="password-input">
            <div>
              <label htmlFor="password">Password</label>
            </div>
            <input
              type="password"
              name="password"
              id="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Enter password..."
              value={password}
            ></input>
          </div>
          <div className="signup-btns">
            <button onClick={checkPassword} className="btn">
              Login
            </button>
            <button onClick={addUser} className="btn">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
