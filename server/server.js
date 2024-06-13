import "dotenv/config";
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

app.get("/", (req, res) => {
  db.query("select * from lists", (err, data) => {
    if (err) return res.send(err);
    return res.send(data);
  });
});

app.post("/addlist", (req, res) => {
  let values = [[req.body.listname]];
  db.query("insert into lists (listname) values ?", [values]);
  res.send("done");
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
  db.query("delete from lists where listname = ?", [req.body.listname]);
  db.query("delete from todos where listname = ?", [req.body.listname]);
  res.send("deleted");
});

app.post("/addtodo", (req, res) => {
  let values = [[req.body.listname, req.body.todo, 'no']];
  db.query("insert into todos (listname, todo, done) values ?", [values]);
  res.send("added");
});

app.post("/setdone", (req, res) => {
  db.query("update todos set ? where todo = ?", [
    { done: req.body.done },
    req.body.todo,
  ]);
  res.send("done");
});

app.delete("/deletedone", (req, res)=>{
    db.query("delete from todos where listname = ? AND done = 'yes'", [req.body.listname]);
    res.send("deleted");
})

app.delete("/deleteall", (req, res) => {
  db.query("delete from todos where listname = ?", [req.body.listname]);
  res.send("deleted");
});

app.listen(PORT, () => {
  console.log(`Server running at http://loalhost:${PORT}`);
});
