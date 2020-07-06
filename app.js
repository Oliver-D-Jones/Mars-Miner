//GLOBAL .class STRINGS
const GAME_LENGTH = 31;
const GAME_CENTER = GAME_LENGTH % 2 ? Math.floor(GAME_LENGTH*GAME_LENGTH/2) : GAME_LENGTH*GAME_LENGTH/2 + GAME_LENGTH/2 ;
const MINE = "mine", COPPER = "copper", GOLD = "gold", PLATINUM = "platinum",AREA = "area";
//attach event listener to images of miners that will
//trigger game by dynamically generating html into page $(document).ready(selectMiner);
$(".avatar").click(function(){oGame.startGame(this);});
$(document).ready(function(){$('[data-toggle="tooltip"]').tooltip();});
$("#upgrades a").click(function(){oGame.purchaseUpgrade(this)});

//-----------------------------------------
// GAME OBJECT
//-----------------------------------------
let oGame = {
  speed: 1000,
  money:0,
  force:1,
  aTable: undefined,
  avatar:{
    person:undefined,
    purchases:[],
  },
  payload: {
    platinum:{
      metal:"Platinum",
      value:10,
      abundance:10,
      collected:0,
      worth:0
    },
    gold:{
      metal:"Gold",
      value:5,
      abundance:24,
      collected:0,
      worth:0
    },
    copper:{
      metal: "Copper",
      value:1,
      abundance: 66,
      collected:0,
      worth:0
    }
  },
  upgrades:{
    locomotive:{
      name:"Locomotive 2.0",
      cost:1000,
      forceMultiplier:1.25,
      available:4,
      multiplier:1,
      purpose:"Locomotives will be neccessary to have in order to transport your mining load to the surface of Mars.",
    },
    ventilator:{
      name: "Ventilator 2.0",
      cost:500,
      forceMultiplier:1.15,
      available:8,
      owned:0,
      multiplier:1,
      purpose:"Ventilators are needed in order keep your crew safe from dangerous gases that can build up in the mine."
    },
    borer:{
      name:"Tunnel Borer 2.0",
      cost: 1200,
      forceMultiplier:1.3,
      available:5,
      multiplier:1,
      purpose:"Boring machines open up access to the mine by boring into mine's wall, thus exposing more mining material."
    },
    drill:{
      name:"Hydraulic Drill 2.0",
      cost:320,
      forceMultiplier:1.14,
      available:10,
      multiplier:1,
      purpose:"Hydraulic drills will increase the amount of exposable mining material.",
    }
  },
  startGame: function(Img){
    $("header").hide();
    $("main").hide();
    $("#game_ui").show();
    document.body.style.backgroundImage = "url(tunnel.jfif)";
    this.generateTable();
    document.getElementById("avatar_img").src = Img.src;
    this.avatar.person = oMiners[Img.alt];
    this.aTable[GAME_CENTER].className = MINE;
    this.insertMetal();
    this.displayMetals();
    this.interval = setInterval(this.update,this.speed,this);
  },
  generateTable: function(){
    let sHTML = "<table id='table'>";
    for(let row = 0; row < GAME_LENGTH; row++){
      sHTML += "<tr>";
      for(let col = 0; col < GAME_LENGTH; col++){
        sHTML += "<td class='area'>&nbsp;</td>"
      }
      sHTML += "</tr>";
    }
    sHTML += "</table>";
    document.getElementById("table_container").innerHTML = sHTML;
    //assign all td elems to oGame.aTable array
    this.aTable = document.getElementsByTagName("td");
    //attach event listeners to each td
    //add xMove and yMove attributes to each td
    for(let t=0; t < this.aTable.length; t++){
      this.aTable[t].moveX = 0;
      this.aTable[t].moveY = 0;
      this.aTable[t].x = t % GAME_LENGTH;
      this.aTable[t].y = Math.floor(t / GAME_LENGTH);
      this.aTable[t].addEventListener("click",this.userClicked,false);
    }
    this.aTable[GAME_CENTER].removeEventListener("click",this.userClicked,false)
  },
  userClicked: function(e){
    if(e.target.className == AREA){
      return;
    }
    oGame.extractMetal(e.target)
  },
  insertMetal: function(){
    let moveX,moveY,random,metal,insert;
    do{
      moveX = Math.floor(Math.random()*3) - 1;
      moveY = Math.floor(Math.random()*3) - 1;
    }while(!moveX && !moveY);
    insert = GAME_CENTER + (moveY * GAME_LENGTH + moveX);
    this.aTable[insert].moveX = moveX;
    this.aTable[insert].moveY = moveY;
    random = Math.random() * 100
    metal = random < 66 ? COPPER : random < 90 ? GOLD : PLATINUM;
    this.aTable[insert].className = metal;
  },
  extractMetal: function(elem){
    this.payload[elem.className].collected++;
    this.payload[elem.className].worth+=Number(this.payload[elem.className].value);
    this.money+=Number(this.payload[elem.className].value);
    elem.className = AREA;
    this.displayMetals();
  },
  update: function(Obj) {
    //check to see if metal is moving out table/AREA
    let aUpdate = [];
    for (let i = 0; i < Obj.aTable.length; i++){
      if(Obj.aTable[i].className != AREA && Obj.aTable[i].className != MINE){
        //there is metal to move
        aUpdate.push(i);
      }
    }
    for(let j = 0; j < aUpdate.length;j++){
      let index = aUpdate[j];
      let newX = Obj.aTable[index].x + Obj.aTable[index].moveX;
      let newY = Obj.aTable[index].y + Obj.aTable[index].moveY;
      if(newX < 0 || newX > GAME_LENGTH - 1){
        Obj.aTable[index].className = AREA;
        Obj.aTable[index].moveX = 0;
        Obj.aTable[index].moveY = 0;
      }
      else if(newY < 0 || newY > GAME_LENGTH - 1){
        Obj.aTable[index].className = AREA;
        Obj.aTable[index].moveX = 0;
        Obj.aTable[index].moveY = 0;
      }
      else{
        let newCellIndex = newY * GAME_LENGTH + newX;
        Obj.aTable[newCellIndex].className = Obj.aTable[index].className;
        Obj.aTable[newCellIndex].moveX = Obj.aTable[index].moveX; 
        Obj.aTable[newCellIndex].moveY = Obj.aTable[index].moveY; 
        Obj.aTable[index].className = AREA;
        Obj.aTable[index].moveY = 0;
        Obj.aTable[index].moveX = 0;
      }
    }
    Obj.insertMetal();
  },
  purchaseUpgrade(elem){

    let oPurchase = this.upgrades[elem.id];
    //check to see if they have the funds
    let iCost = oPurchase.cost * oPurchase.multiplier;
    if(this.money < iCost){
      alert("Sorry but you don't currently have the funds for this purchase.")
    }
    else if(oPurchase.available<=0){
      alert("Sorry but that item is no longer available.")
    }
    else{
      let bMakePurchase = confirm("Are you sure you want to make this purchase?");
      if(!bMakePurchase)
        return;
      this.money-=iCost;
      this.displayMetals();
      this.avatar.purchases.push(oPurchase);
      oPurchase.multiplier++;
      oPurchase.available--;
      let aForce = this.avatar.purchases;
      let totalForce = 1;
      for(let i = 0; i < aForce.length;i++){
        totalForce*=aForce[i]["forceMultiplier"];
      }
      this.force = totalForce;
      for(let metal in this.payload){
        this.payload[metal].value *= this.force;
        this.payload[metal].value = this.payload[metal].value.toFixed(2);

      }
      elem.innerHTML = `<p><span>${oPurchase.name} : $${oPurchase.cost}</span><span>Availble : ${oPurchase.available}</p>`
      this.displayMetals();
      alert("You're purchase was successful.")
    } 
  },
  displayMetals: function(){
    //items collected,value,equip
    let oMetalsOut = document.getElementById("metals");
    let sMetals = "";
    let oMetals = this.payload;
    //display metals that have been mined...
    for(let i in oMetals){
      sMetals += `<div class="col- ${oMetals[i].metal.toLowerCase()}"><span class="metal_head">${oMetals[i].metal} : </span>`;
      sMetals += `<span>Collected : ${oMetals[i].collected}</span>`;
      sMetals += `<span>Value Of : ${oMetals[i].value}</span>`;
      sMetals += `<span>$ From : ${oMetals[i].worth}</span>`;
      sMetals+="</div>"
    }
    sMetals+=`<p>MONEY : $${this.money.toFixed(2)}</p>`
    oMetalsOut.innerHTML = sMetals;
  }
}
