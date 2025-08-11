import mysql from 'mysql';


const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "employeems"
})
connection.connect(function(err) {
    if(err){
        console.log("Connections error")
    } else{
        console.log("Connected")
    }
})