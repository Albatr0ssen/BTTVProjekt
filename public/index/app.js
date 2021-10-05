GetEmote();
ClickEmoteEventListener();

async function GetEmote(){
    let emote;
    await fetch('/getEmote').then(async res => {
        await res.json().then(res => {
            emote = res;
        })
    })
    console.log(emote);
    
    for (let index = 0; index <= 1; index++) {
        document.querySelector(`div[emote="${index}"]`).innerHTML = `
        <img src="${emote[index].emoteURL}" alt="${emote[index].emoteName}">
        <span>${emote[index].emoteName}</span>
        `
        emote[index].image = new Image();
        emote[index].image.onload = EmoteLoaded(index, emote);
        emote[index].image.src = emote[index].emoteURL;
    }
}

function EmoteLoaded(index, emote){
    emote[index].loaded = true;
    console.log(emote[0].loaded, emote[1].loaded)
    if(emote[0].loaded && emote[1].loaded){
        console.log(emote[0].loaded, emote[1].loaded)
        document.querySelector('div[loading]').remove();
        document.querySelector('body').classList.remove("loading");
        document.querySelector('body').classList.add("active");
        document.querySelector('div[emote="0"]').classList.remove("hidden");
        document.querySelector('div[emote="1"]').classList.remove("hidden");
    }
}
function ClickEmoteEventListener(){
    document.querySelector('div[emote="0"]').addEventListener("click", () => {
        document.querySelector('div[emote="0"]').remove();
    })
    document.querySelector('div[emote="1"]').addEventListener("click", () => {
        document.querySelector('div[emote="1"]').remove();
    })
}