const express = require('express');
const app = express();
const mysql = require('mysql');
const { body, validationResult } = require('express-validator');
const poolConfig = require('./config.js')
const port = poolConfig.port;
app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({extended: true}))

var pool = mysql.createPool({
    connectionLimit: 100,
    host: poolConfig.host,
    user: poolConfig.user,
    password: poolConfig.password,
    database: poolConfig.database
});

// pool.query("SELECT emoteID, emoteName, usageCount, emoteURL FROM emotes", (req, res) => {
//     errors = []
//     console.log(res.length)
//     for (let i = 1; i <= 486; i++) {
//         testa = {bol: false, emote: []}
//         res.forEach(emote => {
//             if(emote.emoteID == i){
//                 console.log(`${emote.emoteID}, ${i} | '${emote.emoteName}', '${emote.usageCount}', '${emote.emoteURL}'`)
//                 pool.query("SELECT emoteID FROM emotesTest ORDER BY desc", (req, res) => {
//                     if(res == undefined){
//                         id = 1
//                     }
//                     else{
//                         id = parseInt(res[0].emoteID) + 1
//                     }
                    
//                     pool.query(`INSERT INTO emotesTest (emoteID, emoteName, usageCount, emoteURL) VALUES (${id}, '${emote.emoteName}', '${emote.usageCount}', '${emote.emoteURL}')`, (req, res => {console.log(req, res)}))
//                 })
                
//             }
//         })
//     }
//     console.log("DONE")
// })

// pool.query("SELECT emoteID, emoteName, usageCount, emoteURL FROM emotes", (req, res) => {
//     index = 1
//     res.forEach(emote => {
//         pool.query(`INSERT INTO emotesTest (emoteID, emoteName, usageCount, emoteURL) VALUES (${index}, '${emote.emoteName}', '${emote.usageCount}', '${emote.emoteURL}')`, 
//         // (req, res => {console.log(req, res)})
//         )
//         index++
//     })
// })

// pool.query("SELECT emoteID, emoteName, usageCount, emoteURL FROM emotesTest", (req, res) => {
//     index = 1
//     res.forEach(emote => {
//         count = emote.usageCount.split(',').join('')
//         pool.query(`UPDATE emotesTest SET usageCount = ${count} WHERE emoteID = ${emote.emoteID}`, 
//         (req, res => {console.log(req, res)})
//         )
//         index++
//     })
// })

pool.query("SELECT emoteID, emoteName, usageCount, emoteURL FROM emotesTest ORDER BY usageCount desc", (req, res) => {
    index = 1
    res.forEach(emote => {
        pool.query(`INSERT INTO emotesTest2 (emoteID, emoteName, usageCount, emoteURL) VALUES (${index}, '${emote.emoteName}', '${emote.usageCount}', '${emote.emoteURL}')`, 
        (req, res => {console.log(req, res)})
        )
        index++
    })
})

function test(res, ids){
    for (let i = 0; i < ids.length; i++) {
        if(parseInt(res.emoteID) == ids[i] + 1){
            
            return true;
        }
    }
    return false;
}

// pool.query("SELECT emoteID, emoteURL FROM emotes WHERE emoteID >= 19", (req, res) => {
//     res.forEach(res => {
//         number = parseInt(res.emoteID) + 1;
//         console.log("UPDATE emotes SET emoteID = " + number + " WHERE emoteURL = '" + res.emoteURL + "'")
//         pool.query("UPDATE emotes SET emoteID = " + number + " WHERE emoteURL = '" + res.emoteURL + "'", (req, res) => {
            
//             console.log(req, res)
//         })
//     });
// })

// pool.query("SELECT emoteID, emoteURL FROM emotes WHERE emoteID >= 18", (req, res) => {
//     res.forEach(res => {
//         number = parseInt(res.emoteID) + 1;
//         console.log("UPDATE emotes SET emoteID = " + number + " WHERE emoteURL = " + res.emoteURL)
//     });
// })