import "dotenv/config";
import bcrypt from "bcrypt";
import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) console.log(err);
  else console.log("Database connected");
});

// AUTHENTICATION

app.post("/get", (req, res) => {
  db.query(
    "select * from todoUsers where token = ?",
    [req.body.token],
    (err, data) => {
      if (err) {
        console.log(err);
        return res.send({
          status: false,
          message:
            "Server didn't respond. Try reloading the page to see if it works.",
        });
      }
      if (data.length) {
        return res.send({ status: true, data: data[0] });
      } else {
        return res.send({
          status: false,
          message: "Access token compromised! Please login again!",
        });
      }
    }
  );
});

app.post("/add", async (req, res) => {
  let password = req.body.password;
  let username = req.body.username;
  let userExists = false;
  db.query(
    "select * from todoUsers where username = ?",
    [username],
    async (err, data) => {
      if (err) {
        return res.send({
          status: false,
          message:
            "Server didn't respond. Try reloading the page to see if it works.",
        });
      }
      if (data.length) {
        userExists = true;
      }
      if (username == "" || password == "") {
        return res.send({
          status: false,
          message: "Username and password cannot be empty!",
        });
      } else {
        if (userExists) {
          return res.send({
            status: false,
            message: "Username already exists!",
          });
        } else {
          let hash = await bcrypt.hash(password, 10);
          let token = await bcrypt.hash(username, 10);
          db.query(
            "insert into todoUsers (username, password, token) values (?, ?, ?)",
            [username, hash, token],
            (err, row) => {
              if (err) {
                console.log(err);
                return res.send({
                  status: false,
                  message:
                    "Server didn't respond. Try reloading the page to see if it works.",
                });
              }
            }
          );
          db.query(
            "select * from todoUsers where username = ?",
            [username],
            (err, data) => {
              if (err) {
                console.log(err);
                return res.send({
                  status: false,
                  message:
                    "Server didn't respond. Try reloading the page to see if it works.",
                });
              }
              return res.send({ status: true, row: data });
            }
          );
        }
      }
    }
  );
});

app.post("/pass", async (req, res) => {
  let username = req.body.username;
  let userExists = false;
  db.query(
    "select * from todoUsers where username = ?",
    [username],
    async (err, data) => {
      if (err) {
        console.log(err);
        return res.send({
          status: false,
          message:
            "Server didn't respond. Try reloading the page to see if it works.",
        });
      }
      if (data.length) {
        userExists = true;
      }
      if (userExists) {
        let accept = await bcrypt.compare(req.body.password, data[0].password);
        if (accept) {
          let token = await bcrypt.hash(username, 10);
          db.query(
            "update todoUsers set ? where username = ?",
            [{ token: token }, username],
            (err, dt) => {
              if (err) {
                console.log(err);
                return res.send({
                  status: false,
                  message:
                    "Server didn't respond. Try reloading the page to see if it works.",
                });
              }
            }
          );
          db.query(
            "select * from todoUsers where username = ?",
            [username],
            (err, data) => {
              if (err) {
                console.log(err);
                return res.send({
                  status: false,
                  message:
                    "Server didn't respond. Try reloading the page to see if it works.",
                });
              }
              return res.send({ status: true, row: data });
            }
          );
        } else {
          return res.send({ status: false, message: "Incorrect password!" });
        }
      } else {
        return res.send({
          status: false,
          message: "Username doesnot exist! Sign in to create user.",
        });
      }
    }
  );
});

// TODOS

app.post("/", (req, res) => {
  db.query(
    "select * from todoLists where listuser = ?",
    [req.body.username],
    (err, data) => {
      if (err) {
        return res.send(err);
      }
      return res.send(data);
    }
  );
});

app.post("/addlist", (req, res) => {
  console.log("addlist");
  let values = [[req.body.username, req.body.listname]];
  db.query(
    "insert into todoLists (listuser, listname) values ?",
    [values],
    (err, data) => {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      return res.send(data);
    }
  );
});

app.post("/getlist", (req, res) => {
  db.query(
    "select todo, done from todos where listid = ?",
    [req.body.listid],
    (err, data) => {
      if (err) return res.send(err);
      return res.send(data);
    }
  );
});

app.delete("/deletelist", (req, res) => {
  db.query("delete from todoLists where id = ? and listuser = ?", [req.body.listid, req.body.User], (err, data)=>{
    if (err) {
      console.log(err);
    }
  });
  db.query("delete from todos where listid = ?", [req.body.listid], (err, data)=>{
    if (err) {
      console.log(err);
    }
  });
  res.send("deleted");
});

app.post("/addtodo", (req, res) => {
  let values = [[req.body.listid, req.body.todo, "no"]];
  db.query("insert into todos (listid, todo, done) values ?", [values]);
  res.send("added");
});

app.post("/setdone", (req, res) => {
  db.query("update todos set ? where listid = ?", [
    { done: req.body.done },
    req.body.todoid,
  ]);
  res.send("done");
});

app.delete("/deletedone", (req, res) => {
  db.query("delete from todos where listid = ? AND done = 'yes'", [
    req.body.listid,
  ]);
  res.send("deleted");
});

app.delete("/deleteall", (req, res) => {
  db.query("delete from todos where listid = ?", [req.body.listid]);
  res.send("deleted");
});

app.listen(PORT, () => {
  console.log(`Server running at http://loalhost:${PORT}`);
});
