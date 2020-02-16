const partyReference = {R: "Republican",D: "Democrat",I: "Independant"};

const statesReference = {
  AL: "Alabama",AK: "Alaska",AZ: "Arizona",AR: "Arkansas",CA: "California",CO: "Colorado",
  CT: "Connecticut",DE: "Delaware",DC: "Distrito de Columbia",FL: "Florida",GA: "Georgia",
  HI: "Hawaii",ID: "Idaho",IL: "Illinois",IN: "Indiana",IA: "Iowa",KS: "Kansas",
  KY: "Kentucky",LA: "Luisiana",ME: "Maine",MD: "Maryland",MA: "Massachusetts",
  MI: "Míchigan",MN: "Minnesota",MS: "Misisipi",MO: "Misuri",MT: "Montana",NE: "Nebraska",
  NV: "Nevada",NH: "Nuevo Hampshire",NJ: "Nueva Jersey",NM: "Nuevo México",
  NY: "Nueva York",NC: "Carolina del Norte",ND: "Dakota del Norte",OH: "Ohio",
  OK: "Oklahoma",OR: "Oregón",PA: "Pensilvania",RI: "Rhode Island",SC: "Carolina del Sur",
  SD: "Dakota del Sur",TN: "Tennessee",TX: "Texas",UT: "Utah",VT: "Vermont",VA: "Virginia",
  WA: "Estado de Washington",WV: "Virginia Occidental",WI: "Wisconsin",WY: "Wyoming"
}

let urlsrc, who;
if(document.querySelector("#senate")){
  urlsrc = "https://api.propublica.org/congress/v1/113/senate/members.json";
  who = "senator";
}
else if (document.querySelector("#house")){
  urlsrc = "https://api.propublica.org/congress/v1/113/house/members.json";
  who = "representative";
}

const app = new Vue({
  el: "#app",
  data: {
    url: urlsrc,
    init: {
      method: "GET",
      headers: {
        "X-API-Key": "BMvFaz2nxYWepqJal2Spn9nwn07Tplm2MbgfYWTX"
      }
    },
    members: [],
    parties: [],
    partiesRef: partyReference,
    stateAct: "All",
    states: [],
    statesRef: statesReference,
    heads: [who+"'s_name", "party_affilication", "state", "seniority", "votes"],
    leastEngaged: [],
    mostEngaged: [],
    leastLoyal: [], 
    mostLoyal: [],
    totales: {Republican: {reps: 0, votes: 0},Democrat: {reps: 0, votes: 0},Independant: {reps: 0, votes: 0},Total: {reps: 0}}
  },
  created(){
    fetch(this.url, this.init)
    .then(function(res){
      if(res.ok){
        return res.json();
      }
      else {
        throw new Error(res.status);
      }
    })
    .then(function(json){
      app.members = json.results[0].members;
      app.parties = app.getKeyValue(app.members,"party");
      app.states = app.getKeyValue(app.members,"state");
      app.states.sort();
      app.leastEngaged = app.getArray(app.members,"missed_votes_pct",false);
      app.mostEngaged = app.getArray(app.members,"missed_votes_pct",true);
      app.leastLoyal = app.getArray(app.members,"votes_with_party_pct",true);
      app.mostLoyal = app.getArray(app.members,"votes_with_party_pct",false);
      app.calculateTotal();
    })
    .catch(function(error){
      console.log(error);
    })
  },
  methods:{
    toPhrase(string){
      if(string.length > 1){
        return string.split("_").map(e => e[0].toUpperCase() + e.slice(1)).join(" ");
      }else{
        return string[0].toUpperCase() + string.slice(1);
      }
    },
    getKeyValue(array,key){
      let result = []
      array.forEach(e => !result.includes(e[key]) ? result.push(e[key]) : null);
      return result
    },
    getValue(object,key){
      let value = object[key];
      if(value) return object[key];
      else return key;
    },
    getArray(array,key,directo){
      let result = [];
      let aux = array.filter(m => m.total_votes != 0);
      aux = directo?[...aux].sort((a,b) => a[key] - b[key]):[...aux].sort((a,b) => b[key] - a[key])
      let tenPct = parseInt(aux.length*0.1);
      let i = 0;
      while(i<tenPct || aux[i][key] == aux[i-1][key]){
        result.push(aux[i]);
        i++;
      }
      return result;
    },
    calculateTotal(){
      app.members.forEach(m => {
        if(m.party == "R"){
          app.totales.Republican.reps++;
          app.totales.Republican.votes+= m.votes_with_party_pct;
        }
        else if(m.party == "D"){
          app.totales.Democrat.reps++;
          app.totales.Democrat.votes+= m.votes_with_party_pct;
        }
        else {
          app.totales.Independant.reps++;
          app.totales.Independant.votes+= m.votes_with_party_pct;
        }
        app.totales.Total.reps++;
      })
      app.totales.Republican.votes = app.totales.Republican.votes!=0?app.totales.Republican.votes/app.totales.Republican.reps:0;
      app.totales.Democrat.votes = app.totales.Democrat.votes!=0?app.totales.Democrat.votes/app.totales.Democrat.reps:0;
      app.totales.Independant.votes = app.totales.Independant.votes!=0?app.totales.Independant.votes/app.totales.Independant.reps:0;
    }
  },
  computed:{
    filterMembers(){
      return this.members.filter(m => app.parties.includes(m.party) && (m.state == app.stateAct || app.stateAct == "All"));
    }
  }
})