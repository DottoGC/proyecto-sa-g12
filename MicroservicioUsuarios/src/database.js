const mysql = require('mysql');
const con = mysql.createConnection({
    host: "db-mysql",
    port: 3306,
    user: "root",
    password: "root",
    database: "usuarios_bd"
  });
  
  con.connect(function(err) {
    if (err) console.log(err);
    console.log("Connected!");
  });

