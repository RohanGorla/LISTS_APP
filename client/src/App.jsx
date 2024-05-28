import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import axios from "axios";
import "./styles/App.css";

function App() {
  const [lists, setLists] = useState([]);
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState("");
  const [listInput, setListInput] = useState("");
  const [currentList, setCurrentList] = useState("");

  useEffect(() => {
    getLists();
  }, []);

  async function getLists() {
    await axios
      .get(`${import.meta.env.VITE_BASE_URL}/`)
      .then((response) => {
        setLists(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function addList() {
    await axios
      .post(`${import.meta.env.VITE_BASE_URL}/addlist`, { listname: listInput })
      .then((response) => {
        getLists();
      })
      .catch((err) => console.log(err));
    setListInput("");
  }

  async function selectList(listname) {
    await axios
      .post(`${import.meta.env.VITE_BASE_URL}/getlist`, { listname: listname })
      .then((response) => {
        setTodos(response.data);
        setCurrentList(listname);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function deleteList(listname) {
    await axios
      .delete(`${import.meta.env.VITE_BASE_URL}/deletelist`, {
        data: { listname },
      })
      .then((response) => {
        getLists();
        if (currentList == listname) {
          selectList('');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function addTodo() {
    await axios
      .post(`${import.meta.env.VITE_BASE_URL}/addtodo`, {
        listname: currentList,
        todo: todoInput,
      })
      .then((response) => {
        selectList(currentList);
      })
      .catch((err) => {
        console.log(err);
      });
    setTodoInput("");
  }

  async function setDone(id, todo_done) {
    await axios
      .post(`${import.meta.env.VITE_BASE_URL}/setdone`, {
        id: id,
        done: todo_done == "yes" ? "no" : "yes",
      })
      .then((response) => {
        selectList(currentList);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function deleteDone(listname) {
    await axios
      .delete(`${import.meta.env.VITE_BASE_URL}/deletedone`, {
        data: { listname },
      })
      .then((response) => {
        selectList(currentList);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function deleteAll(listname) {
    await axios
      .delete(`${import.meta.env.VITE_BASE_URL}/deleteall`, {
        data: { listname },
      })
      .then((response) => {
        selectList(currentList);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <div className="main-container">
        <div className="header">
          <h1>THIS IS MY TODO LIST</h1>
        </div>
        <div className="todo-container">
          <div className="todo-list-container">
            <div className="list-header">
              <h2>MY TODO-LISTS</h2>
            </div>
            <div className="list-input">
              <input
                id="list-name"
                placeholder="LIST NAME..."
                onChange={(e) => {
                  setListInput(e.target.value);
                }}
                value={listInput}
              ></input>
              <button
                onClick={() => {
                  addList();
                }}
              >
                ADD
              </button>
            </div>
            <div className="todo-lists">
              {lists.map((list) => {
                return (
                  <div className="list-card" key={list.id}>
                    <h3 className="list-name">{list.listname}</h3>
                    <div className="list-options">
                      <button
                        className="select-list"
                        onClick={() => {
                          selectList(list.listname);
                        }}
                      >
                        Select
                      </button>
                      <button
                        className="delete-list"
                        onClick={() => {
                          deleteList(list.listname);
                        }}
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="todos-container">
            <div className="todos-header">
              <h2>{currentList}</h2>
              {/* <div className="count">
                <p>1 todo left</p>
              </div> */}
            </div>
            <div className="todos-input">
              {/* <div className="todos-title">
                <label>Title</label>
                <input></input>
              </div> */}
              <div className="todos-content">
                {/* <label>Content</label> */}
                <input
                  placeholder="New todo item..."
                  onChange={(e) => {
                    setTodoInput(e.target.value);
                  }}
                  value={todoInput}
                ></input>
                <button
                  onClick={() => {
                    addTodo();
                  }}
                >
                  ADD
                </button>
              </div>
            </div>
            <div className="todos">
              {todos.map((todo) => {
                return (
                  <div className="todo-card" key={todo.id}>
                    {/* <h3 className="todo-title">THIS IS A TODO</h3> */}
                    <div className="todo-info">
                      <p className={todo.done == "yes" ? "todo done" : "todo"}>
                        {todo.todo}
                      </p>
                      <button
                        className="btn-done"
                        onClick={() => {
                          setDone(todo.id, todo.done);
                        }}
                      >
                        DONE
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="todos-options">
              <button
                className="remove-finished"
                onClick={() => {
                  deleteDone(currentList);
                }}
              >
                REMOVE FINISHED TODOS
              </button>
              <button
                className="remove-all"
                onClick={() => {
                  deleteAll(currentList);
                }}
              >
                REMOVE ALL TODOS
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
