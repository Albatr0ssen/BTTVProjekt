const express = require('express');
const app = express();
const mysql = require('mysql');
const poolConfig = require('./config.js')
const port = poolConfig.port;
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

app.get("/emote", (req, res) => {
    let random = [Math.floor(Math.random() * 485) + 1, Math.floor(Math.random() * 485) + 1];
    while(random[1] == random[0]){
        random[1] = Math.floor(Math.random() * 485) + 1;
    }
    pool.query(`SELECT emoteName, emoteURL FROM emotes WHERE emoteID IN ( ${random[0]}, ${random[1]} )`, (err, response) => {
        if(err){ return console.log('error: ' + err.message) }
        res.send(response)
    })
})

app.get("/db", (req, res) => {
    pool.query("SELECT * FROM emotes", (err, response) => {
        if(err){ return console.log('error: ' + err.message) }
        // let index = 0;
        // response.forEach(element => {
        //     index++;
        //     pool.query(`UPDATE emotes SET emoteID = null WHERE emoteID = ` + element.emoteID + ` `, (err, response) => {
        //         if(err){ return console.log('error: ' + err.message) }
        //         console.log(response.emoteID)
        //     })
        // });
        // res.sendStatus(200);

        // let big = [];
        // response.forEach(emote1 => {
        //     response.forEach(emote2 => {
        //         if(emote1.emoteName == emote2.emoteName && emote1.emoteID != emote2.emoteID){
        //             console.log(emote1.emoteID, emote2.emoteID)
        //             big.push({
        //                 "emote1": emote1,
        //                 "emote2": emote2,
        //             })
        //         }
        //     });
        // });
        // res.send(big);
    })
})

app.listen(port, () => {
    console.log(`Port Open At ${poolConfig.port}`)
})