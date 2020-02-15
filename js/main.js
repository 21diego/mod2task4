function changeString(stringIn, compare, replace){
    if(stringIn == compare){
        return replace;
    }
    return stringIn;
}

statesFull = {
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


let table = document.querySelector("#table-data");
let tbody = document.querySelector("tbody");

let members = data.results[0].members;
let states = [];

function filtrar(){
    tbody.innerHTML = "";
    let partiesCheck=document.querySelectorAll(".parties:checked");
    let select=document.querySelector("#states-select");
    let value = select.value;
    //states = [];
    partiesCheck.forEach(check => 
        members.filter(member => 
            member.party === check.value && (statesFull[member.state] === value || value === "all")).forEach(member => {
                let row = tbody.insertRow(-1);
                row.innerHTML = `<td><a href="${changeString(member.url,"","#")}">${member.last_name}, ${member.first_name} ${changeString(member.middle_name,null,"")}</a></td>`
                +`<td>${member.party}</td><td>${member.state}</td><td>${member.seniority}`
                +`<td>${member.votes_with_party_pct}%</td>`;
                if(states.indexOf(statesFull[member.state]) == -1){
                    states.push(statesFull[member.state]);
                }
            }));
    let option;
    select.innerHTML = "<option value='all'>all</option>";
    for(let i = 0; i < states.length; i++){
        option = document.createElement("option");
        option.setAttribute("value", states[i]);
        option.innerHTML = states[i];
        select.appendChild(option);
    }
    select.value = value;
}

document.querySelector("#rep").addEventListener("click",filtrar);
document.querySelector("#dem").addEventListener("click",filtrar);
document.querySelector("#ind").addEventListener("click",filtrar);
document.querySelector("#states-select").addEventListener("change",filtrar);
filtrar();
        
// Holaaa dieguitooo <]:{V
        
        
/******************************/
        
        