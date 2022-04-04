import Data from "./utilities/dataHandling.js";
import * as apiUtilities from "./utilities/apiUtilities.js";
//hi
const attractions = await apiUtilities.getAttractions();

let DataObject = new Data();
let PlayerData = DataObject.getData();

let selectedBuilding = null;

var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
function preload ()
{
    //this.load.setBaseURL('http://labs .phaser.io');
    this.load.image('background', 'image/background.png');
    this.load.spritesheet('field', 'image/yow.png', { frameWidth: 222, frameHeight: 121 });
}

function disableAll()
{
    attractions.forEach(obj => (
        window[obj.name].disableInteractive()
    ));
}

function enableAll()
{
    attractions.forEach(obj => (
        window[obj.name].setInteractive()
    ));
}

function create ()
{   
    //Event listener
    let popup = document.getElementById('construction');
    let closeButton = document.getElementById("close");
    let build = document.getElementById("build-button");
    build.addEventListener("click", construire)

    closeButton.addEventListener("click", function(){
        popup.style.display = 'none';
    })

    
    this.add.image(900, 485, 'background'); 

    attractions.forEach(obj => {
        console.log(obj.name);
        window[obj.name] = this.add.sprite(    
            obj.pos_x,
            obj.pos_y,
            obj.image);
        window[obj.name].setInteractive().on('pointerdown', () => checkBuilding(obj));
        window[obj.name].setFrame(0);
    

    });

    if (PlayerData.UnlockedBuildings != [])
    {
        PlayerData.UnlockedBuildings.forEach(element => {
             attractions.forEach(obj => {
                 if (element == obj.id)
                 {
                     obj.status = "alreadyBuilt";
                     window[obj.name].setFrame(1);
                 }
            }); 
            console.log(element);
        })
    }
    let pos = 0;
    for (const [key, value] of Object.entries(PlayerData.Currency)) {
        let txt = this.add.text(100*pos, 0, key+' : '+value, { font: '"Press Start 2P"' });
        pos += 1;

        DataObject.On(key, function(newValue){
            txt.setText(key+' : '+newValue);
            if(key==="Crystals"){
                //ICI update le text
            }
        })
    }
}

function update(){
    if(Date.now() - PlayerData.lastAward > 1000){
        PlayerData.lastAward = Date.now();
        let gold = 0;

        console.log(PlayerData.UnlockedBuildings);
        for (const [key, value] of Object.entries(PlayerData.UnlockedBuildings)) {
            gold += attractions[value-1].rendings;
        }
        
        PlayerData.Currency.Gold += gold;

        DataObject.updateData();
    }
}


function checkBuilding(building)
{  
    selectedBuilding = building.id;
    switch (building.status){
        case "build":
            displayBuildWindow(building);
            break;
        case "alreadyBuilt":
            displayUpgradeWindow(building)
            break;
    }
}
function construire(building,popup){

    let prix = building.price;
    if (PlayerData.Currency.Gold >= prix)
    {
        PlayerData.Currency.Gold -= prix;
        window[building.name].setFrame(1);
        building.status = "alreadyBuilt";
        PlayerData.UnlockedBuildings.push(building.id)
        DataObject.updateData();
        popup.style.display = 'none';
        
    }
    else
    {
        popup.style.display = 'none';
        //window.alert("il vous manque " + (prix - argent) + " or")
    }
    enableAll();

}
function displayBuildWindow (building)
{
    
    disableAll();

    let build = document.getElementById("build-button");
    
    
    build.addEventListener("click", () => construire(building,popup))

    let popup = document.getElementById('construction');
    if (popup && popup.style.display === 'none' ){
        popup.style.display = 'block';
    }
    document.getElementById("price").innerHTML = "Price : " + building.price + " Gold"
    document.getElementById("name").innerHTML = building.name
    document.getElementById("rendings").innerHTML = "Rendings : " + building.rendings + " Gold per second"

    
   

    let button = document.getElementById("close");
    button.addEventListener("click", () => {
        popup.style.display = 'none'
        build.removeEventListener("click", () => construire(building,popup))
        enableAll();
    })
    

}


function displayUpgradeWindow (building)
{
    
    let popup = document.getElementById('upgrade');
    if (popup && popup.style.display === 'none' ){
        popup.style.display = 'block';
    }
    let button = document.getElementById("close-upgrade");
    button.addEventListener("click", () => (
        popup.style.display = 'none'    
    ))


}