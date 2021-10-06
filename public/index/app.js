let sessionID;
EmotesSetup();

function EmotesSetup(){
    if(StorageTest() === true){
        // let localStorage = window.localStorage;
        if(localStorage.getItem('userID') == null){
            //FETCH USERID
        }
    }
    else{
    
    }

    GetEmote();
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
            "userID": 1111111111,
            "emoteChoice": choiceID
        })
    })
    GetEmote();
}

function StorageTest(){
    var test = 'test';
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } 
    catch(e) {
        return false;
    }
}

