import React, { useState } from "react";
import Todos from "./components/Todos.jsx";
import Login from "./components/LoginPage.jsx";

function App() {
  const [give, setGive] = useState(false);
  const [logout, setLogout] = useState(false);
  const [user, setUser] = useState("");

  return <>{give ? <Todos setgive={setGive} logout={setLogout} currentuser={user}/> : <Login callback={setGive} logout={logout} setlogout={setLogout} setuser={setUser}/>}</>;
}

export default App;
