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

app.post("/postEmote", 
body('sessionID').isLength({min: 10}, {max: 10}),
body('userID').isLength({min: 10}, {max: 10}),
body('emoteChoice').isLength({min: 0}, {max: 2}),
(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let sessionID = req.body.sessionID;
    sessions.forEach(session => {
        if(session.sessionID == sessionID){
            emotes = session.emotes;
        }
        else{
            res.sendStatus(400)
        }
    })

    let userInfo = {
        "sessionID": sessionID, 
        "userID": req.body.userID,
        "emotes": emotes,
        "emoteChoice": req.body.emoteChoice,
        "submissionTime": new Date()
    }

    

    res.sendStatus(200);
})

app.get("/getEmote", (req, res) => {
    let sessionInfo = {};
    let random = [Math.floor(Math.random() * 485) + 1, Math.floor(Math.random() * 485) + 1];
    while(random[1] == random[0]){
        random[1] = Math.floor(Math.random() * 485) + 1;
    }
    pool.query(`SELECT emoteName, emoteURL FROM emotes WHERE emoteID IN ( ${random[0]}, ${random[1]} )`, (err, response) =>  {
        if(err){ return console.log('error: ' + err.message) }

        sessionInfo.emotes = [{
            "emoteName": response[0].emoteName,
            "emoteURL": response[0].emoteURL
        }, {
            "emoteName": response[1].emoteName,
            "emoteURL": response[1].emoteURL
        }]

        let base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-_";
        let sessionID;
        while(!IDInUse(sessionID)){
            sessionID = "";
            for(let i = 0; i < 10; i++){
                sessionID += base64[Math.floor((Math.random() * 64))];
            }
        }
        sessionInfo.sessionID = sessionID;
        sessions.push(sessionInfo);
        res.send(sessionInfo)
    })  
})

function IDInUse(sessionID){
    if(sessionID == null){ return false; }
    sessions.forEach(session => {
        if(session.sessionID == sessionID){
            return false;
        }
    })
    return true;
}

function SessionEmotes(sessionID){
    sessions.forEach(session => {
        console.log(session.sessionID)
        console.log(sessionID)
        if(session.sessionID == sessionID){
            console.log(session.emotes)
            return session.emotes;
        }
        else{
            console.log("YO")
        }
    })
}

app.listen(port, () => {
    console.log(`Port Open At ${poolConfig.port}`)
})