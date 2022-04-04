import Data from "./utilities/dataHandling.js";
import * as apiUtilities from "./utilities/apiUtilities.js";

const attractionsData = await apiUtilities.getAttractions();
let DataObject = new Data();
let PlayerData = DataObject.getData();
let Currency = document.getElementById("Currency-Counter");

console.log(PlayerData)

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

var game = new Phaser.Game(config);

function preload() {
    this.load.image('buttonSprite', 'pictures/Vector-Button-Transparent-PNG.png');
    this.load.image('buttonSpriteReverse', 'pictures/Vector-Button-Reversed-Transparent-PNG.png')
}

function create() {
    Currency.textContent += PlayerData.Currency.Gold;

    let pos = 0;
    for (const [key, value] of Object.entries(PlayerData.Currency)) {
        let txt = this.add.text(100 * pos, 0, key + ' : ' + value, { font: '"Press Start 2P"' });
        pos += 1;

        DataObject.On(key, function (newValue) {
            txt.setText(key + ' : ' + newValue);
            if (key === "Gold") {
                Currency.innerHTML = PlayerData.Currency.Gold;
            }
        })
    }

    setTimeout(() => {
        PlayerData.Currency.Gold += 1; //set value
        DataObject.updateData(); //update
    }, 2000);

    var recruitButton = this.add.image(400, 300, 'buttonSprite', 0).setInteractive();
    var recruitButtonReverse = this.add.image(400, 300, 'buttonSpriteReverse', 0).setInteractive();

    recruitButtonReverse.visible = false;

    recruitButton.setScale(0.1);
    recruitButtonReverse.setScale(0.1);


    recruitButton.on('pointerover', function () {

        recruitButton.visible = false;
        recruitButtonReverse.visible = true;

    });

    recruitButtonReverse.on('pointerout', function () {

        recruitButtonReverse.visible = false;
        recruitButton.visible = true;

    });

    recruitButtonReverse.on('pointerup', () => {

        let element = document.getElementById('Recruit-Menu')
        if (element && element.style.display === 'none') {

            element.style.display = 'block';

        }
    });
}