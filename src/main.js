import Data from "./utilities/dataHandling.js";
import * as apiUtilities from "./utilities/apiUtilities.js";

const attractionsData = await apiUtilities.getAttractions();
const minionsData = await apiUtilities.getMinions();
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

    let MainWrapper = document.getElementById("Card-Wrapper");

    minionsData.forEach(function (data, index) {

        function create(tagName, props) {
            return Object.assign(document.createElement(tagName), (props || {}));
        }

        function ac(p, c) {
            if (c) p.appendChild(c);
            return p;
        }

        var column = create("div", {
            className: "column"
        });

        var card = create("div", {
            className: "card"
        });

        function TroopIncrement(id) {
            switch (id) {
                case "1":
                    console.log("Troop 1");
                    PlayerData.Troops.Troop1 += 1;
                    console.log(PlayerData.Troops);
                    break;
                case "2":
                    console.log("Troop 2");
                    PlayerData.Troops.Troop2 += 1;
                    console.log(PlayerData.Troops);
                    break;
                case "3":
                    console.log("Troop 3");
                    PlayerData.Troops.Troop3 += 1;
                    console.log(PlayerData.Troops);
                    break;
                case "4":
                    console.log("Troop 4");
                    PlayerData.Troops.Troop4 += 1;
                    console.log(PlayerData.Troops);
                    break;
                case "5":
                    console.log("Troop 5");
                    PlayerData.Troops.Troop5 += 1;
                    console.log(PlayerData.Troops);
                    break;
                case "6":
                    console.log("Troop 6");
                    PlayerData.Troops.Troop6 += 1;
                    console.log(PlayerData.Troops);
                    break;
                case "7":
                    console.log("Troop 7");
                    PlayerData.Troops.Troop7 += 1;
                    console.log(PlayerData.Troops);
                    break;
                case "8":
                    console.log("Troop 8");
                    PlayerData.Troops.Troop8 += 1;
                    console.log(PlayerData.Troops);
                    break;
                case "9":
                    console.log("Troop 9");
                    PlayerData.Troops.Troop9 += 1;
                    console.log(PlayerData.Troops);
                    break;
                default:
                    console.log("Error, something happened during incrementation of troops");
            }
        }

        if (PlayerData.Currency.Gold < data.price) {
            card.className += " brightness"
          } else {
            card.className = "card"
            card.addEventListener("click", () => (
                TroopIncrement(data.id),
                DataObject.updateData()
            ));
          }

        var cardImage = create("img", {
            className: "Card-Image",
            src: data.image,
            alt: "Portrait"
        });

        var CardBottom = create("div", {
            className: "Card-Bottom flex"
        });

        var UnitCost = create("div", {
            className: "Unit-Cost"
        });

        var CostIcon = create("img", {
            className: "Cost-Icon",
            src: "pictures/3bf2be9160f1cd10cb04c3fb3gfdggdsggfdedb5c4_2.png",
            alt: "Currency Icon"
        });

        var Price = create("h3", {
            className: "h-null",
            id: "Unit-Cost"
        })

        Price.textContent += data.price;

        ac(MainWrapper, ac(column, ac(card, cardImage)));
        ac(MainWrapper, ac(column, ac(card, ac(CardBottom, ac(UnitCost, CostIcon)))));
        ac(UnitCost, Price);
    });
}