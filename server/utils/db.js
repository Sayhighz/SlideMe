import mysql from 'mysql'

const con = mysql.createConnection({
    host: "th55.ruk-com.in.th",
    user: "slidemep_root",
    password: "tCjWrta3Y3WhscrgT3PY",
    database: "slidemep_database"
})

con.connect(function (err) {
    if (err) {
        console.log("connection error")
    } else {
        console.log("Connected")
    }
})

export default con