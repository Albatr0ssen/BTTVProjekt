WriteRankedLists();

async function WriteRankedLists(){
    let voteRanked;
    let ratioRanked;
    await fetch('/getRanked').then(async res => {
        await res.json().then(res => {
            console.log(res)
            voteRanked = res[0]
            ratioRanked = res[1]
        })
    }) 

    for (let i = 0; i < 100; i++) {
        document.querySelector("#voteCount").innerHTML += `
            <div class="emote">
                <span>${i + 1}.</span>
                <div>
                    <img class="emote-img" src="${voteRanked[i].emote.emoteURL}" alt="${voteRanked[i].emote.emoteName}">
                    <span>${voteRanked[i].emote.emoteName}</span>
                </div>
                <span>${voteRanked[i].voteCount}</span>
                <span>${Math.round(voteRanked[i].ratio * 100)/100}</span>
            </div>
        `
    }

    for (let i = 0; i < 100; i++) {
        document.querySelector("#ratioCount").innerHTML += `
            <div class="emote">
                <span>${i + 1}.</span>
                <div>
                    <img class="emote-img" src="${ratioRanked[i].emote.emoteURL}" alt="${ratioRanked[i].emote.emoteName}">
                    <span>${ratioRanked[i].emote.emoteName}</span>
                </div>
                <span>${ratioRanked[i].voteCount}</span>
                <span>${Math.round(ratioRanked[i].ratio * 100)/100}</span>
            </div>
        `
    }

    document.querySelector("#ratioButton").addEventListener("click", () => {
        if(document.querySelector("#voteCount").classList.length == 0){
            document.querySelector("#voteCount").classList.add("none");
            document.querySelector("#ratioCount").classList.remove("none");
        }
    })

    document.querySelector("#voteButton").addEventListener("click", () => {
        if(document.querySelector("#ratioCount").classList.length == 0){
            document.querySelector("#ratioCount").classList.add("none");
            document.querySelector("#voteCount").classList.remove("none");
        }
    })


}
