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
      
    }
  },
  computed:{
    filterMembers(){
      return this.members.filter(m => app.parties.includes(m.party) && (m.state == app.stateAct || app.stateAct == "All"));
    }
  }
})