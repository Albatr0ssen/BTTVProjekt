let sessionID;
EmotesSetup();

function EmotesSetup(){
    if(StorageTest("local") === true){
        if(localStorage.getItem('userID') == null){
            GetUserID("local");
        }
    }
    else if(StorageTest("session") === true){
        GetUserID("session");
    }

    GetEmote();
    ClickEmoteEventListener(1);
    ClickEmoteEventListener(2);
    ButtonEvents();
}

async function GetEmote(){
    let randomLoading = Math.floor(Math.random() * 3);
    if(randomLoading == 0){document.querySelector("#loading").src = "img/widepeepoHappy.png"}
    else if(randomLoading == 1){document.querySelector("#loading").src = "img/widepeepoSad.png"}
    else if(randomLoading == 2){document.querySelector("#loading").src = "img/WideHardo.png"}
    
    document.querySelector("#loading").classList.remove("none")
    document.querySelector(`div[emote="1"]`).classList.add("hidden")
    document.querySelector(`div[emote="2"]`).classList.add("hidden")
    
    await fetch('/getEmote').then(async res => {
        await res.json().then(res => {
            sessionID = res.sessionID;
            emote = res.emotes;
        })
    })  
    let images = [[false, ""], [false, ""]]
    for (let index = 0; index <= 1; index++) {
        let emoteCard = `
        <div class="emote-background-dark">
            <div class="emote-background center">
                <img class=".btn" src="${emote[index].emoteURL}" alt="${emote[index].emoteName}">
                <span>${emote[index].emoteName}</span>
            </div>
        </div>   
        `        
        let img1 = new Image();
        img1.onload = () => {  images[index][0] = true; images[index][1] = emoteCard; LoadEmotes(images); }
        img1.src = emote[index].emoteURL;
    }
}

function LoadEmotes(images){
    if(images[0][0] == true && images[1][0] == true){
        document.querySelector(`div[emote="1"]`).innerHTML = images[0][1];
        document.querySelector(`div[emote="2"]`).innerHTML = images[1][1];
        document.querySelector(`div[emote="1"]`).classList.remove("hidden")
        document.querySelector(`div[emote="2"]`).classList.remove("hidden")
        document.querySelector("#loading").classList.add("none")
    }
}

function ClickEmoteEventListener(choiceID){
    document.querySelector(`div[emote="${choiceID}"]`).addEventListener("click", () => { PostEmote(choiceID) })
}

function PostEmote(choiceID){
    fetch("postEmote",
    {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            "sessionID": sessionID,
            "userID": UserID(),
            "emoteChoice": choiceID
        })
    })
    GetEmote();
}

function StorageTest(type){
    var test = 'test';
    if(type == "local"){
        try {
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } 
        catch(e) {
            return false;
        }
    }
    else if(type == "session"){
        try {
            sessionStorage.setItem(test, test);
            sessionStorage.removeItem(test);
            return true;
        } 
        catch(e) {
            return false;
        }
    }
}

async function GetUserID(type){
    await fetch("getUserID",
    {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            "storageType": type
        })
    })
    .then(async res => {
        await res.json().then(res => {
            if(type == "local"){
                localStorage.setItem("userID", res.userID)
                console.log(localStorage.getItem("userID"))        
            }
            else if(type == "session"){
                sessionStorage.setItem("userID", res.userID)
            }
        })
    })  
}

function UserID(){
    if(StorageTest("local") === true){
        return localStorage.getItem("userID");
    }
    else if(StorageTest("session") === true){
        return sessionStorage.getItem("userID");
    }
    else{
        return "1111111111";
    }
}

function ButtonEvents(){
    document.querySelector('div[emote="1"]').addEventListener("mouseover", () => {
        document.querySelector('div[emote="1"] div.emote-background-dark div.emote-background').classList.add("emote-down-animation");
    });

    document.querySelector('div[emote="2"]').addEventListener("mouseover", () => {
        document.querySelector('div[emote="2"] div.emote-background-dark div.emote-background').classList.add("emote-down-animation");
    });
}