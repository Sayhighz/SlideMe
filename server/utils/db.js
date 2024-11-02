import mysql from 'mysql'

const con = mysql.createConnection({
    host: "103.253.75.87",
    user: "Sayhigh",
    password: "0819897031!Sayhi",
    database: "slideme"
})

con.connect(function (err) {
    if (err) {
        console.log("connection error")
    } else {
        console.log("Connected")
    }
})

export default con