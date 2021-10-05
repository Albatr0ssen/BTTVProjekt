const express = require('express');
const app = express();
const mysql = require('mysql');
const { body, validationResult } = require('express-validator');
const poolConfig = require('./config.js')
const port = poolConfig.port;
app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({extended: true}))

let sessions = [];

var pool = mysql.createPool({
    connectionLimit: 100,
    host: poolConfig.host,
    user: poolConfig.user,
    password: poolConfig.password,
    database: poolConfig.database
});

app.use("/", express.static("public/index"))

app.get("/test", (req, res) => {
    let base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-_";
    let thisID = "";
    for(let i = 0; i < 10; i++){
        thisID += base64[Math.floor((Math.random() * 64))];
    }
    res.send(thisID)
})

app.post("/postEmote", 
body('requestID').isLength({min: 10}, {max: 10}),
body('personalID').isLength({min: 10}, {max: 10}),
body('emoteChoice').isLength({min: 0}, {max: 2}),
(req, res) => {
    // base64 requestID, base64 userID, emoteChoice
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    let date = new Date();
    // let userInfo = {
    //     "sessionID": sessionID, 
    //     "userID": "userID", 
    //     "emotes": [emote1, emote2],
    //     "emoteChoice": 2,
    //     "submissionTime": date
    // }

    pool.query("SELECT Invite_ID from playfie_invite order by Invite_ID desc", (err, result, fields) => {
        if(err){ return console.log('error: ' + err.message) }
        
    })
})

app.get("/getEmote", (req, res) => {
    let random = [Math.floor(Math.random() * 485) + 1, Math.floor(Math.random() * 485) + 1];
    while(random[1] == random[0]){
        random[1] = Math.floor(Math.random() * 485) + 1;
    }
    pool.query(`SELECT emoteName, emoteURL FROM emotes WHERE emoteID IN ( ${random[0]}, ${random[1]} )`, (err, response) => {
        if(err){ return console.log('error: ' + err.message) }
        console.log(response)
        // res.send(response)
    })
    let base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-_";
    let sessionID = "";
    for(let i = 0; i < 10; i++){
        sessionID += base64[Math.floor((Math.random() * 64))];
    }
    sessions.push({
        "sessionID": sessionID, 
        "emotes": [emote1, emote2],
    })
    res.send(sessions)
})

app.listen(port, () => {
    console.log(`Port Open At ${poolConfig.port}`)
})