const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const DBPort = process.env.DBPORT || 3000;
const host = process.env.DBHOST || "localhost";
const username = process.env.DBUSERNAME || "root";
const password = process.env.DBPWD || "";
const database = process.env.DBNAME || "signup";
const serverPORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host,
  user: username,
  password,
  database,
  port: DBPort,
});

const createTableQuery = `
    CREATE TABLE if not exists users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
    )
  `;

// Execute the query to create the table
db.query(createTableQuery, (queryErr, result) => {
  if (queryErr) {
    process.exit(1);
  } else {
    console.log("Table created successfully:", result);
  }
});

app.post("/Signup", (req, res) => {
  const sql = "INSERT INTO users (`name`, `email`,`password`) VALUES (?)";
  const values = [req.body.name, req.body.email, req.body.password];
  db.query(sql, [values], (err, data) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "failed to create account", error: err });
    }
    return res.json(data);
  });
});

app.listen(serverPORT, () => {
  console.log("listening");
});
