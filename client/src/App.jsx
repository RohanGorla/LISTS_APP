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
  const [show, setShow] = useState(false);
  const [left, setLeft] = useState(0);

  useEffect(() => {
    getLists();
    console.log("render")
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

  async function selectList(listname, listid) {
    await axios
      .post(`${import.meta.env.VITE_BASE_URL}/getlist`, { listid: listid })
      .then((response) => {
        setTodos(response.data);
        let left = 0;
        response.data.forEach((todo) => {
          if (todo.done == "no") {
            left += 1;
          }
        });
        setLeft(left);
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
          selectList("");
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

  async function setDone(todo, todo_done) {
    await axios
      .post(`${import.meta.env.VITE_BASE_URL}/setdone`, {
        todo: todo,
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
      <div className={show ? "lists-mobile" : "lists-mobile not-visible"}>
        <div
          className="close-button"
          onClick={() => {
            setShow(!show);
          }}
        >
          <span className="cross"></span>
          <span className="cross2"></span>
        </div>
        <h2 className="lists-mobile-title">ADD NEW LIST</h2>
        <div className="add_list-mobile">
          <div className="add_list-input-mobile">
            <input
              type="text"
              placeholder="Enter new list..."
              onChange={(e) => {
                setListInput(e.target.value);
              }}
              value={listInput}
            ></input>
          </div>
          <div
            className="add_list-button-mobile"
            onClick={() => {
              if (listInput.length) {
                addList();
              }
            }}
          >
            <span className="btn">ADD</span>
          </div>
        </div>
        <h2 className="lists-mobile-title">MY TODO LISTS</h2>
        <div className="show_lists-mobile">
          {lists.map((list) => {
            return (
              <div className="list_card" key={list.id}>
                <div className="card-background"></div>
                <h3 className="list_name-mobile">{list.listname}</h3>
                <div className="list_options-mobile">
                  <div
                    className="select_list-mobile"
                    onClick={() => {
                      selectList(list.listname, list.id);
                    }}
                  >
                    <span className="btn">Select</span>
                  </div>
                  <div
                    className="delete_list-mobile"
                    onClick={() => {
                      deleteList(list.listname);
                    }}
                  >
                    <span className="btn">Delete</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <nav>
        <div className="container">
          <div
            className="list-toggle"
            onClick={() => {
              setShow(!show);
            }}
          >
            <span className="hamburger"></span>
          </div>
          <div className="logo">
            <h1 className="nav-title">TODO-LISTS</h1>
          </div>
        </div>
      </nav>

      <header>
        <div className="container">
          <h2 className="header-title">THIS IS MY TODO LIST</h2>
        </div>
      </header>

      <div className="main">
        <div className="container main_row">
          <div className="lists section">
            <div className="background"></div>
            <div className="add_list">
              <h2 className="lists-title">ADD NEW LIST</h2>
              <div className="add_list-input">
                <input
                  type="text"
                  placeholder="Enter new list..."
                  onChange={(e) => {
                    setListInput(e.target.value);
                  }}
                  value={listInput}
                ></input>
              </div>
              <div
                className="add_list-button"
                onClick={() => {
                  if (listInput.length) {
                    addList();
                  }
                }}
              >
                <span className="btn">ADD</span>
              </div>
            </div>
            <h2
              className="lists-title"
              style={lists.length ? null : { display: "none" }}
            >
              MY TODO LISTS
            </h2>
            <p
              className="no-lists"
              style={
                lists.length ? { display: "none" } : { textAlign: "center" }
              }
            >
              No lists to show
            </p>
            <div
              className="show_lists"
              style={lists.length ? null : { display: "none" }}
            >
              {lists.map((list, index) => {
                return (
                  <div className="list_card" key={index}>
                    <div className="card-background"></div>
                    <h3 className="list_name">{list.listname}</h3>
                    <div className="list_options">
                      <div
                        className="select_list"
                        onClick={() => {
                          selectList(list.listname, list.id);
                        }}
                      >
                        <span className="btn">Select</span>
                      </div>
                      <div
                        className="delete_list"
                        onClick={() => {
                          deleteList(list.listname);
                        }}
                      >
                        <span className="btn">Delete</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="todos section">
            <div className="background"></div>
            <div className="add_todo">
              <h2 className="todos-title">ADD NEW TODO</h2>
              <div className="add_todo-input">
                <input
                  type="text"
                  placeholder="Enter new todo..."
                  onChange={(e) => {
                    setTodoInput(e.target.value);
                  }}
                  value={todoInput}
                ></input>
              </div>
              <div
                className="add_todo-button"
                onClick={() => {
                  if (todoInput.length && currentList) {
                    let exists = false;
                    for (let i = 0; i < todos.length; i++) {
                      if (todos[i].todo == todoInput) {
                        exists = true;
                        break;
                      }
                    }
                    if (!exists) {
                      addTodo();
                    }
                  }
                }}
              >
                <span className="btn">ADD</span>
              </div>
            </div>
            <div
              className="todos_header"
              style={currentList ? null : { display: "none" }}
            >
              <h2 className="current_list">{currentList}</h2>
              <p className="todos_count">Todos left: {left}</p>
            </div>
            <p
              style={
                todos.length ? { display: "none" } : { textAlign: "center" }
              }
            >
              No todos to show
            </p>
            <div
              className="show_todos"
              style={todos.length ? null : { display: "none" }}
            >
              {todos.map((todo, index) => {
                return (
                  <div className="todo_card" key={index}>
                    <div className="card-background"></div>
                    <p
                      className={
                        todo.done == "yes" ? "todo_info done" : "todo_info"
                      }
                    >
                      <span>{todo.todo}</span>
                    </p>
                    <div
                      className="todo_done-button"
                      onClick={() => {
                        setDone(todo.todo, todo.done);
                      }}
                    >
                      <span className="btn">
                        {todo.done == "yes" ? "UNDO" : "DONE"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              className="todos_options"
              style={todos.length ? null : { display: "none" }}
            >
              <div
                className="remove_finished-button"
                onClick={() => {
                  deleteDone(currentList);
                }}
              >
                <span className="btn">REMOVE FINISHED TODOS</span>
              </div>
              <div
                className="remove_all-button"
                onClick={() => {
                  deleteAll(currentList);
                }}
              >
                <span className="btn">REMOVE ALL TODOS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
