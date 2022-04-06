import Data from "./utilities/dataHandling.js";
import * as apiUtilities from "./utilities/apiUtilities.js";
import { MAX_ZOOM, MIN_ZOOM } from "./utilities/global.js";

const LAYERS = 4;
const attractions = await apiUtilities.getAttractions();

let DataObject = new Data();
let PlayerData = DataObject.getData();

var text;

let selectedBuilding = null;

var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
};

var game = new Phaser.Game(config);
function preload ()
{
    //this.load.setBaseURL('http://labs .phaser.io');
    this.load.image('field', 'image/field.png');
    this.load.image('built', 'image/built.png');

	this.load.image('base_tiles', 'public/assets/tiles.png')

	// load the JSON file
	this.load.tilemapTiledJSON('map', 'public/assets/map.json')

   
}

function create ()
{   
    //camera
    var cam = this.cameras.main;

    cam.setZoom(0.3);

    this.input.on("pointermove", function (p) {
        if (!p.isDown) return;

        cam.scrollX -= (p.x - p.prevPosition.x) / cam.zoom;
        cam.scrollY -= (p.y - p.prevPosition.y) / cam.zoom;
    });

    this.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ) {
        let newZoom = cam._zoomY;
        console.log(cam._zoomY, deltaY);
        if(deltaY>0 && cam._zoomY < MAX_ZOOM){
            newZoom += 0.05;
        }else if(deltaY<0 && cam._zoomY > MIN_ZOOM){
            newZoom -= 0.05;
        }
        cam.setZoom(newZoom);
    });

    //map
    var map = this.add.tilemap('map');

    var tileset1 = map.addTilesetImage('tiles', 'base_tiles');
    for (let i=1; i<LAYERS; i++) {
        map.createLayer('Tile Layer ' + i, [tileset1]);
    }

    //Event listener
    let popup = document.getElementById('construction');
    let closeButton = document.getElementById("close");
    let build = document.getElementById("build-button");
    build.addEventListener("click", construire)

    closeButton.addEventListener("click", function(){
        popup.style.display = 'none';
    })

    var argent = 1500; // simulation de l'argent de l'utilisateur

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
            if(key==="Crystals"){
                //ICI update le text
            }
        })
    }
}

function update(){
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
function construire(){
    let building = attractions[selectedBuilding-1];
    let popup = document.getElementById('construction');
    
    let prix = building.price;
    if (PlayerData.Currency.Gold >= prix)
    {
        //console.log(PlayerData.Currency.Gold);
        PlayerData.Currency.Gold -= prix;
        //console.log(PlayerData.Currency.Gold);
        building.status = "alreadyBuilt";
        PlayerData.UnlockedBuildings.push(building.id)
        DataObject.updateData();
        console.log("ADD");
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