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
  res.send("Hello...");
});

app.listen(PORT, () => {
  console.log(`Server running at http://loalhost:${PORT}`);
});
