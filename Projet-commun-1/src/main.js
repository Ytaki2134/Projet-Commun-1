
import * as apiUtilities from "./utilities/apiUtilities.js";
import {checkBuilding, DataObject, PlayerData} from "./module/building.js"




const attractions = await apiUtilities.getAttractions();


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


function create ()
{   

    
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
        for (const [key, value] of Object.entries(PlayerData.UnlockedBuildings)) {
            gold += attractions[value-1].rendings;
        }
        
        PlayerData.Currency.Gold += gold;
        DataObject.updateData();
    }
}


