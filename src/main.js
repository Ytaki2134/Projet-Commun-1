import Data from "./utilities/dataHandling.js";

let DataObject = new Data();
let PlayerData = DataObject.getData();

console.log(PlayerData);

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
        this.add.text(100*pos, 0, key+' : '+value, { font: '"Press Start 2P"' });
        pos += 1;
    }
}

var game = new Phaser.Game(config);