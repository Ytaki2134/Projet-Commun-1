import Data from "./utilities/dataHandling.js";
import * as apiUtilities from "./utilities/apiUtilities.js";

const attractionsData = await apiUtilities.getAttractions();
let DataObject = new Data();
let PlayerData = DataObject.getData();

console.log(attractionsData);

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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

function preload ()
{
    
}

function create ()
{
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

var game = new Phaser.Game(config);