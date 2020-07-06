//Global object thaat contains the initial miner's data
let oMiners = {
  doug:{
    name:"Doug",
    age: 32,
    experience: 16,
    ability: 88,
    health: 90,
    employees:5,
    luck: 40,
  },
  fox:{
    name: "Fox",
    age: 64,
    experience: 48,
    ability: 94,
    health: 82,
    employees: 3,
    luck: 33,
  },
  joe:{
    name: "Joe",
    age: 45,
    experience: 26,
    ability: 86,
    health: 87,
    employees: 4,
    luck: 36,
  }
}
//generate miner attribrutes on index page dynamically
function genMinerAttr(){
  let sHTML = ""
  for(let miner in oMiners){
    for(let att in oMiners[miner]){
      sHTML+=`<p>${att.toUpperCase()} : ${oMiners[miner][att]}</p>`;
    }
    document.getElementById(miner).innerHTML = sHTML; 
    sHTML = "";
  }
}
//call genMinerAttr immediately
genMinerAttr();