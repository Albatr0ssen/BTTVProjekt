WriteToplist();
async function WriteToplist(){
    let votes;
    await fetch('/getVotes').then(async res => {
        await res.json().then(res => {
            votes = res;
        })
    })  

    //ADD DIFFERENT EMOTE WITH SAME NAME SUPPORT
    let toplist = {}
    votes.forEach(vote => {
        try{
            toplist[vote.emoteName].voteCount += 1;
        }
        catch{
            toplist[vote.emoteName] = {
                voteCount: 1,
                emote: vote
            };
        }
    });
    
    let ranked = [];
    console.log(toplist)
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
    
    for (let i = 0; i < 50; i++) {
        document.querySelector("main").innerHTML += `
            <div class="emote">
                <span>${i + 1}.</span>
                <img class="emote-img" src="${ranked[i].emote.emoteURL}" alt="${ranked[i].emote.emoteName}">
                <span>${ranked[i].emote.emoteName}</span>
                <span>${ranked[i].voteCount}</span>
            </div>
        `
    }
}
