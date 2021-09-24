const express = require('express');
const app = express();
const port = poolConfig.port;
const mysql = require('mysql');
const poolConfig = require('./config.js')
app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({extended: true}))
var pool = mysql.createPool({
    connectionLimit: 10,
    host: poolConfig.host,
    user: poolConfig.user,
    password: poolConfig.password,
    database: poolConfig.database
});

app.use("/", express.static("public/index"))

app.get("/db", (req, res) => {
    pool.query("SELECT * FROM test", (err, response) => {
        if(err){ return console.log('error: ' + err.message) }
        res.send(response);
    })
})

app.listen(port, () => {
    console.log("HTTP Port Open (Port 3000)")
})