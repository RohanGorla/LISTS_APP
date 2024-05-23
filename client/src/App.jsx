import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./styles/App.css";

function App() {
  return (
    <>
      <div className="main-container">
        <div className="header">
          <h1>THIS IS MY TODO LIST</h1>
        </div>
        <div className="todo-container">
          <div className="todo-list-container">
            <div>
              <h2>MY TODO-LISTS</h2>
            </div>
            <div className="list-input">
              <input></input>
              <button>+</button>
            </div>
            <div className="todo-lists">
              <div className="list-card">
                <h3 className="list-name">LIST NAME</h3>
                <button className="create-list">Select</button>
                <button className="delete-list">DELETE</button>
              </div>
            </div>
          </div>
          <div className="todos-container">
            <div className="todos-header">
              <h2>TODO-LIST NAME</h2>
              <div className="count">
                <p>1 todo left</p>
              </div>
            </div>
            <div className="todo-input">
              <input></input>
              <button>+</button>
            </div>
            <div className="todos">
              <div className="todo-card">
                <h3 className="todo-title">THIS IS A TODO</h3>
                <p className="todo-content">THIS IS THE TODO CONTENT</p>
                <button className="button-done">DONE</button>
              </div>
            </div>
            <div className="todo-options">
              <button className="remove-finished">REMOVE FINISHED</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
