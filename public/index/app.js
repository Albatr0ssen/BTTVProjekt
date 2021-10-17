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
    //REMOVES LOADING SCREEN
    document.querySelector('div[loading]').remove();
    document.querySelector('main').classList.remove("loading");
    document.querySelector('main').classList.add("active");
    document.querySelector('div[emote="1"]').classList.remove("hidden");
    document.querySelector('div[emote="2"]').classList.remove("hidden");
    HTMLAddon();
    // ClickEmoteEventListener(1);
    // ClickEmoteEventListener(2);
    // ButtonEvents();
}

async function GetEmote(){
    let emote;
    await fetch('/getEmote').then(async res => {
        await res.json().then(res => {
            sessionID = res.sessionID;
            emote = res.emotes;
        })
    })  
    for (let index = 0; index <= 1; index++) {
        document.querySelector(`div[emote="${index + 1}"]`).innerHTML = `
        <div class="emote-background-dark">
            <div class="emote-background center">
                <img class="emote-img .btn" src="${emote[index].emoteURL}" alt="${emote[index].emoteName}">
                <span>${emote[index].emoteName}</span>
            </div>
        </div>   
        `
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
        document.querySelector('div[emote="1"] div.emote-background-dark').classList.add("emote-move");
        console.log("OVER 1")
    });
    document.querySelector('div[emote="1"]').addEventListener("mouseout", () => {
        document.querySelector('div[emote="1"] div.emote-background-dark').classList.remove("emote-move");
        console.log("OUT 1")
    });
    document.querySelector('div[emote="2"]').addEventListener("onmouseover", () => {
        
    });
}

function HTMLAddon(){
    document.querySelector('main').innerHTML += `
    <div class="peepo-hey-div">
        <span class="peepo-hey-text"> @Albatr0ssen in chat </span>
        <img class="peepo-hey" src="https://cdn.betterttv.net/emote/5c0e1a3c6c146e7be4ff5c0c/3x" alt="peepoHey">
    </div
    `
}