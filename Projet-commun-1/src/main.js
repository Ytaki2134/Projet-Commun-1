import Data from "./utilities/dataHandling.js";
import * as apiUtilities from "./utilities/apiUtilities.js";

const attractions = await apiUtilities.getAttractions();

let DataObject = new Data();
let PlayerData = DataObject.getData();


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
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    //this.load.setBaseURL('http://labs .phaser.io');
    this.load.image('background', 'image/background.png');
    this.load.image('field', 'image/field.png');
    this.load.image('built', 'image/built.png');
}

function create ()
{   
    //alert(myBuildings[0].name);
    //console.log(attractions[2].name);
    var argent = 1500; // simulation de l'argent de l'utilisateur
    this.add.image(900, 485, 'background'); 

    attractions.forEach(obj => {
        console.log(obj.name);
        window[obj.name] = this.add.image(    
            obj.pos_x,
            obj.pos_y,
            obj.image);
        window[obj.name].setInteractive().on('pointerdown', () => checkBuilding(obj,argent));

    });
    if (PlayerData.UnlockedBuildings != [])
    {
        PlayerData.UnlockedBuildings.forEach(element => {
             attractions.forEach(obj => {
                 if (element == obj.id)
                 {
                     obj.status = "alreadyBuilt";
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
        })
    }

    setTimeout(() => {
        PlayerData.Currency.Gold +=1; //set value
        DataObject.updateData(); //update
    }, 2000);
}
    


function checkBuilding(building)
{   
    switch (building.status){
        case "build":
            displayBuildWindow(building);
            break;
        case "alreadyBuilt":
            displayUpgradeWindow(building)
            break;
    }
}
function construire(building,popup,argent){

    let prix = building.price;
    if (PlayerData.Currency.Gold >= prix)
    {
        //console.log(PlayerData.Currency.Gold);
        PlayerData.Currency.Gold -= prix;
        //console.log(PlayerData.Currency.Gold);
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

}
function displayBuildWindow (building)
{
    
    let popup = document.getElementById('construction');
    if (popup && popup.style.display === 'none' ){
        popup.style.display = 'block';
    }
    let button = document.getElementById("close");
    button.addEventListener("click", () => (
        popup.style.display = 'none'
    ))
    let build = document.getElementById("build-button");
    build.addEventListener("click", () => construire(building,popup))

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