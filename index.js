const express = require('express');
const app = express();
const fs = require('fs'),
    https = require('https')
const mysql = require('mysql');
const { body, validationResult } = require('express-validator');
const poolConfig = require('./config.js')
const port = poolConfig.port;
app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({extended: true}))

let sessions = [];
let ranks = [];

var pool = mysql.createPool({
    connectionLimit: 100,
    host: poolConfig.host,
    user: poolConfig.user,
    password: poolConfig.password,
    database: poolConfig.database
});

app.use("/", express.static("public/index"))

app.use("/info", express.static("public/info"))

app.get("/getRanked", (req, res) => {
    if(ranks.length != 0 && ranks[2] + 3600000 > Date.now()) {res.send([ranks[0], ranks[1]]);}
    else{
        pool.query(`SELECT emotes, emoteChoice FROM votes`, (err, response) =>  {
            let winVotes = []
            response.forEach(vote => {
                let emotes = JSON.parse(vote.emotes)  
                winVotes.push(emotes[vote.emoteChoice - 1])
            });

            pool.query(`SELECT emotes, emoteChoice FROM votes`, (err, response) =>  {
                let loseVotes = []
                response.forEach(vote => {
                    let emotes = JSON.parse(vote.emotes)  
                    if(vote.emoteChoice == 1){
                        loseVotes.push(emotes[1])
                    }
                    else if(vote.emoteChoice == 2){
                        loseVotes.push(emotes[0])
                    }
                    
                });
                let toplist = {}
                winVotes.forEach(vote => {
                    try{
                        toplist[vote.emoteURL].voteCount += 1;
                    }
                    catch{
                        toplist[vote.emoteURL] = {
                            voteCount: 1,
                            emote: vote
                        };
                    }
                });

                let botlist = {}
                loseVotes.forEach(vote => {
                    try{
                        botlist[vote.emoteURL].voteCount += 1;
                    }
                    catch{
                        botlist[vote.emoteURL] = {
                            voteCount: 1,
                            emote: vote
                        };
                    }
                });
                
                let ranked = [];
                for (let i = 0;  i < Object.values(toplist).length;i++) {
                    let added = false;
                    if(ranked.length == 0){
                        ranked.push(Object.values(toplist)[i]);
                        added = true
                    }
                    else{
                        for (let j = 0; j < ranked.length; j++) {              
                            if(Object.values(toplist)[i].voteCount > ranked[j].voteCount){
                                ranked.splice(j, 0, Object.values(toplist)[i]);
                                added = true
                                break;
                            }
                        }
                    }
                    if(!added){
                        ranked.push(Object.values(toplist)[i]);
                    }
                }

                ranked.forEach(emote => {
                    try{
                        emote.ratio = emote.voteCount / (botlist[emote.emote.emoteURL].voteCount + emote.voteCount);
                    }
                    catch{
                        emote.ratio = 1;
                    }
                });

                let ratioRanked = [];
                for (let i = 0;  i < ranked.length;i++) {
                    let added = false;
                    if(ranked.length == 0){
                        ratioRanked.push(ranked[i]);
                        added = true
                    }
                    else{
                        for (let j = 0; j < ratioRanked.length; j++) {              
                            if(ranked[i].ratio > ratioRanked[j].ratio){
                                ratioRanked.splice(j, 0, ranked[i]);
                                added = true
                                break;
                            }
                        }
                    }
                    if(!added){
                        ratioRanked.push(ranked[i]);
                    }
                }
                dateNow = Date.now();
                ranks = [ranked, ratioRanked, dateNow]
                res.send([ranks[0], ranks[1]]);
            })  
        })             
    }
})

app.get("/getVotes", (req, res) => {
    pool.query(`SELECT emotes, emoteChoice FROM votes`, (err, response) =>  {
        let votes = []
        response.forEach(vote => {
            let emotes = JSON.parse(vote.emotes)  
            votes.push(emotes[vote.emoteChoice - 1])
        });
        res.send(votes);
    })  
})

app.get("/getLosing", (req, res) => {
    pool.query(`SELECT emotes, emoteChoice FROM votes`, (err, response) =>  {
        let votes = []
        response.forEach(vote => {
            let emotes = JSON.parse(vote.emotes)  
            if(vote.emoteChoice == 1){
                votes.push(emotes[1])
            }
            else if(vote.emoteChoice == 2){
                votes.push(emotes[0])
            }
            
        });
        res.send(votes);
    })  
})

app.post("/getUserID", 
    body('storageType').isLength({min: 1}), 
    (req, res) => {
    //GENERATE ID AND CHECK IF IN USE (PRETTY MUCH IMPOSSIBLE)
    let base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-_";
    let userID;
    while(true){
        if(req.body.storageType == "local"){
            userID = "L";
        }
        else if(res.body.storageType == "session"){
            userID = "S";
        }

        for(let i = 0; i < 9; i++){
            userID += base64[Math.floor((Math.random() * 64))];
        }
        let alreadyCreated = false;
        pool.query(`SELECT userID FROM users`, (err, result) => {
            if(err){ return Error(err.message) }
            result.forEach(result => {
                if(result.userID == userID){
                    alreadyCreated = true;
                }
            })
        })

        if(!alreadyCreated){
            break;
        }
    } 
    console.log(userID)
    //WRITE TO USERS TABLE
    pool.query(`INSERT INTO users (userID, timeCreated) 
                VALUES ('${userID}', '${SQLDate()}')`)

    //SEND BACK ID
    res.send(JSON.stringify({"userID": userID}))
})


app.get("/getEmote", (req, res) => {
    let sessionInfo = {};
    let random = [Math.floor(Math.random() * 485) + 1, Math.floor(Math.random() * 485) + 1];
    while(random[1] == random[0]){
        random[1] = Math.floor(Math.random() * 485) + 1;
    }
    pool.query(`SELECT emoteName, emoteURL FROM emotes WHERE emoteID IN ( ${random[0]}, ${random[1]} )`, (err, result) =>  {
        if(err){ return Error(err.message) }

        sessionInfo.emotes = [{
            "emoteName": result[0].emoteName,
            "emoteURL": result[0].emoteURL
        }, {
            "emoteName": result[1].emoteName,
            "emoteURL": result[1].emoteURL
        }]

        let base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-_";
        let sessionID;
        while(!SessionIDInUse(sessionID)){
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

app.post("/postEmote", 
body('sessionID').isLength({min: 10}, {max: 10}),
body('userID').isLength({min: 10}, {max: 10}),
body('emoteChoice').isLength({min: 0}, {max: 2}),
(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        ErrorWriteToDB(req.body.userID);
        return res.status(400).json({ errors: errors.array() });
    }
    else{
        let sessionID = req.body.sessionID;
        let emotes = [];
        for(let i = 0; i < sessions.length; i++){
            let session = sessions[i];
            if(session.sessionID == sessionID){
                emotes = session.emotes;
                sessions.splice(i, 1)
                break;
            }
        }

        //CHECKS IF SESSION IS AVAILABLE
        if(emotes == []){
            ErrorWriteToDB(req.body.userID)
            res.sendStatus(404)
        }
        else{
            let userInfo = {
                "sessionID": sessionID, 
                "userID": req.body.userID,
                "emotes": emotes,
                "emoteChoice": req.body.emoteChoice,
                "submissionTime": SQLDate()
            }
    
            pool.query(`INSERT INTO votes (emotes, emoteChoice, userID, submissionTime) 
                        VALUES ('${JSON.stringify(userInfo.emotes)}','${userInfo.emoteChoice}', 
                                '${userInfo.userID}', '${userInfo.submissionTime}')`)

            res.send(userInfo);
        }
    }
})

function SessionIDInUse(sessionID){
    if(sessionID == null){ return false; }
    sessions.forEach(session => {
        if(session.sessionID == sessionID){
            return false;
        }
    })
    return true;
}

function ErrorWriteToDB(userID){
    pool.query(`INSERT INTO error (userID, timeCreated) 
                VALUES ('${userID}', '${SQLDate()}')`)
}

function Error(msg){
    console.log(`${SQLDate()}: ${msg}`)
}

function SQLDate(){
    let date = new Date()
    date = date.toISOString().slice(0, 19).replace('T', ' ')
    return date;
}

// const sslServer = https.createServer(
//     {
//         key: fs.readFileSync('./tross.gg.key'),
//         cert: fs.readFileSync('./tross.gg.pem')
//     },
//     app
// )

app.listen(port, () => {
    console.log(`Port Open At ${poolConfig.port}`)
})