let sessionID;
EmotesSetup();

function EmotesSetup(){
    if(StorageTest("local") === true){
        if(localStorage.getItem('userID') == null){
            GetUserID("local");
        }
    }
    
    else if(StorageTest("session") == true){
        GetUserID("session");
    }

    GetEmote();
    //REMOVES LOADING
    document.querySelector('div[loading]').remove();
    document.querySelector('body').classList.remove("loading");
    document.querySelector('body').classList.add("active");
    document.querySelector('div[emote="1"]').classList.remove("hidden");
    document.querySelector('div[emote="2"]').classList.remove("hidden");
    ClickEmoteEventListener(1);
    ClickEmoteEventListener(2);
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
        <img src="${emote[index].emoteURL}" alt="${emote[index].emoteName}">
        <span>${emote[index].emoteName}</span>
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
            "userID": localStorage.getItem("userID"),
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