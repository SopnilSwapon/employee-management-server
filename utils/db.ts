import mysql from "mysql2";

const connection: mysql.Pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "@Swapon04567",
  database: "employeems",
});
connection.getConnection(function (err) {
  if (err) {
    console.log("Connections error", err);
  } else {
    console.log("Connected");
  }
});

export default connection;
