let stats = {
    "totalRep": 0,
    "votedWRep": 0,
    "totalDem": 0,
    "votedWDem": 0,
    "totalInd": 0,
    "votedWInd": 0,
    "totalMembers": 0,
    "leastEngaged": [],
    "mostEngaged": [],
    "leastLoyal": [], 
    "mostLoyal": [],
}

let members = data.results[0].members;

let votesRep = 0;
let votesDem = 0;
let votesInd = 0;
members.forEach(e => {
    if(e.party == "R"){
        stats.totalRep++;
        votesRep += e.votes_with_party_pct;
    }
    else if(e.party == "D"){
        stats.totalDem++;
        votesDem += e.votes_with_party_pct;
    }
    else {
        stats.totalInd++;
        votesInd += e.votes_with_party_pct;
    }
})

stats.totalMembers = stats.totalRep + stats.totalDem + stats.totalInd;
stats.votedWRep = votesRep!=0?votesRep/stats.totalRep:0;
stats.votedWDem = votesDem!=0?votesDem/stats.totalDem:0;
stats.votedWInd = votesInd!=0?votesInd/stats.totalInd:0;

let tenPct = Math.round(stats.totalMembers*0.1);

let tbody = document.querySelector("#table-total>tbody");
let row = tbody.insertRow(-1);
row.innerHTML = `<td>Republican</td><td>${stats.totalRep}</td><td>${(stats.votedWRep).toFixed(2)}%`;
row = tbody.insertRow(-1);
row.innerHTML = `<td>Democrat</td><td>${stats.totalDem}</td><td>${(stats.votedWDem).toFixed(2)}%`;
row = tbody.insertRow(-1);
row.innerHTML = `<td>Independant</td><td>${stats.totalInd}</td><td>${(stats.votedWInd).toFixed(2)}%`;
row = tbody.insertRow(-1);
row.innerHTML = `<td>Total</td><td>${stats.totalMembers}</td><td></td>`;

//Armando lista filtrada para Attendance
//Funcion de comparacion basado en los votos faltantes
function compareMissedVotes(memberA, memberB){
    return memberA.missed_votes_pct - memberB.missed_votes_pct;
}
function compareMissedVotesInverse(memberA,memberB){
    return memberB.missed_votes_pct - memberA.missed_votes_pct;
}
function compareVotesWParty(memberA, memberB){
    return memberA.votes_with_party_pct - memberB.votes_with_party_pct;
}
function compareVotesWPartyInverse(memberA, memberB){
    return memberB.votes_with_party_pct - memberA.votes_with_party_pct;
}

function agregarResto(index,source,array){
    let valueAct = source[index].missed_votes_pct;
    for(let i = index + 1; i < source.length; i++){
        if(source[i].missed_votes_pct == valueAct){
            array.push(source[i]);
        }
    }
}

function cargarDatos(arraySource,arrayReducido){
    for(let i = 0; i < tenPct; i++){
        arrayReducido.push(arraySource[i]);
        if(i == tenPct-1){
            //agregarResto(i,arraySource,arrayReducido);
        }
    }
}

let membersMissedOrd = members.sort(compareMissedVotes);
cargarDatos(membersMissedOrd,stats.mostEngaged);
let membersMissedOrdInv = members.sort(compareMissedVotesInverse);
cargarDatos(membersMissedOrdInv,stats.leastEngaged);
let membersLoyalOrd = members.sort(compareVotesWParty);
cargarDatos(membersLoyalOrd,stats.leastLoyal);
let membersLoyalOrdInv = members.sort(compareVotesWPartyInverse);
cargarDatos(membersLoyalOrdInv,stats.mostLoyal);

function createTbodyAttendance(tbodyIN, arrayIN){
    let tbody = tbodyIN;
    arrayIN.forEach(m => {
        let row = tbody.insertRow(-1);
        row.innerHTML = `<td>${m.last_name}, ${m.first_name} ${m.middle_name?m.middle_name:""}</td>`
        +`<td>${m.missed_votes}</td><td>${m.missed_votes_pct.toFixed(2)}%</td>`;
    })
}

function createTbodyLoyal(tbodyIN, arrayIN){
    let tbody = tbodyIN;
    arrayIN.forEach(m => {
        let row = tbody.insertRow(-1);
        row.innerHTML = `<td>${m.last_name}, ${m.first_name} ${m.middle_name?m.middle_name:""}</td>`
        +`<td>${Math.round((m.total_votes * m.votes_with_party_pct)/100)}</td><td>${m.votes_with_party_pct.toFixed(2)}%</td>`;
    })
}

let tableLeast = document.querySelector("#table-least>tbody");
if(tableLeast){
    createTbodyAttendance(tableLeast, stats.leastEngaged);
}
let tableMost = document.querySelector("#table-most>tbody");
if(document.querySelector("#table-most>tbody")){
    createTbodyAttendance(tableMost, stats.mostEngaged);
}
let tableLeastLoyal = document.querySelector("#table-least-loyal>tbody");
if(tableLeastLoyal){
    createTbodyLoyal(tableLeastLoyal, stats.leastLoyal);
}
let tableMostLoyal = document.querySelector("#table-most-loyal>tbody");
if(tableMostLoyal){
    createTbodyLoyal(tableMostLoyal, stats.mostLoyal);
}