import * as apiUtilities from "./utilities/apiUtilities.js";
import {checkBuilding, DataObject, PlayerData} from "./module/buildings.js"

const attractionsData = await apiUtilities.getAttractions();
const minionsData = await apiUtilities.getMinions();
let Currency = document.getElementById("Currency-Counter");

console.log(PlayerData)

function update() {
    if (Date.now() - PlayerData.lastAward > 1000) {
        PlayerData.lastAward = Date.now();
        let gold = 0;
        for (const [key, value] of Object.entries(PlayerData.UnlockedBuildings)) {
            gold += attractionsData[value - 1].rendings;
        }

        PlayerData.Currency.Gold += gold;
        DataObject.updateData();
    }
}

var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
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
    },
    
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'image/background.png');
    this.load.image('popup', 'image/minion-parchemin.png');
    this.load.image('stable', 'image/construction.png');
    this.load.image('materialButton', 'image/parchemin1.png');
    this.load.image('kamos', 'image/parchemin2.png');
    this.load.image('pop', 'image/parchemin3.png');
    this.load.spritesheet('building', 'image/building.01.png', { frameWidth: 791, frameHeight: 676 });
}

function create() {

    let popupWindow = this.add.image(600, 400, 'popup');
    popupWindow.setScale(0.40)
    popupWindow.setDepth(5)
    popupWindow.setVisible(false)

    let popupStable = this.add.image(600, 700, 'stable')
    popupStable.setScale(0.40)
    popupStable.setDepth(5)
    popupStable.setVisible(false)

    let popup = [popupWindow, popupStable]

    let materialButton = this.add.image(125, 50, 'materialButton');
    materialButton.setScale(0.45)
    materialButton.setDepth(2)

    let kamos = this.add.image(325, 50, 'kamos');
    kamos.setScale(0.45)
    kamos.setDepth(2)

    let population = this.add.image(525, 50, 'pop');
    population.setScale(0.45)
    population.setDepth(2)

    attractionsData.forEach(obj => {
        console.log(obj.name);
        window[obj.name] = this.add.sprite(
            obj.pos_x,
            obj.pos_y,
            obj.image);
        window[obj.name].setInteractive().on('pointerdown', () => checkBuilding(obj, popup));
        window[obj.name].setFrame(0);
        window[obj.name].setScale(.30);


    });

    if (PlayerData.UnlockedBuildings != []) {
        PlayerData.UnlockedBuildings.forEach(element => {
            attractionsData.forEach(obj => {
                if (element == obj.id) {
                    obj.status = "alreadyBuilt";
                    window[obj.name].setFrame(1);
                }
            });
        })
    }

    let pos = 0;
    for (const [key, value] of Object.entries(PlayerData.Currency)) {
        let txt = this.add.text(100 * pos, 0, key + ' : ' + value, { font: '"Press Start 2P"' });
        pos += 1;
        DataObject.On(key, function (newValue) {
            txt.setText(key + ' : ' + newValue);
            if (key === "Gold") {
                Currency.innerHTML = PlayerData.Currency.Gold;
            }
            if (key === "Crystals") {
                //ICI update le text
            }
        })
    }

    Currency.textContent += PlayerData.Currency.Gold;

    setTimeout(() => {
        PlayerData.Currency.Gold += 1; //set value
        DataObject.updateData(); //update
    }, 2000);

    Currency.addEventListener('DOMSubtreeModified', function () {
        var MutationObserver = window.MutationObserver
            || window.WebKitMutationObserver
            || window.MozMutationObserver;
        var observer = new MutationObserver(function () {
            CardRefresh();
        });
        observer.observe(Currency, { childList: true });
    });

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

    let element = document.getElementById('Recruit-Menu')

    recruitButtonReverse.on('pointerup', () => {

        if (element && element.style.display === 'none') {

            element.style.display = 'block';
            DataObject.updateData();
            CardRefresh();

        }
    });

    var Selections = document.getElementsByClassName('Quantity-Font h-null');

    var SelectMultiplier = 1;

    for (let i = 0; i < Selections.length; i++) {
        Selections[i].addEventListener("click", (checkSelect) => {
            var Selected = document.getElementsByClassName('Quantity-Font h-null Select-Quantity');
            if (Selected[0] != null) {
                Selected[0].classList.remove("Select-Quantity");
            }
            var Selection = checkSelect.target;

            switch (Selection.id) {
                case "First-Select":
                    Selection.className = "Quantity-Font h-null Select-Quantity";
                    SelectMultiplier = 1;
                    CardRefresh();
                    break;
                case "Second-Select":
                    Selection.className = "Quantity-Font h-null Select-Quantity";
                    SelectMultiplier = 10;
                    CardRefresh();
                    break;
                default:
                    console.log("Error, something happened during selection")
            }
        })
    }

    //Closing System for Recruit Menu

    document.onclick = function (checkHit) {
        var hit = checkHit.target;
        if (hit.tagName == 'CANVAS' && element.style.display === 'block') {
            element.style.display = 'none';
        }
    };

    //Automated Generation of Recruit Cards 

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
            className: "card",
            id: "card"
        });

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
            src: "image/3bf2be9160f1cd10cb04c3fb3gfdggdsggfdedb5c4_2.png",
            alt: "Currency Icon"
        });

        var Price = create("h3", {
            className: "h-null",
            id: "Unit-Cost",
        })

        Price.setAttribute("name", "Price")
        Price.textContent += data.price;

        //Defining div's children

        ac(MainWrapper, ac(column, ac(card, cardImage)));
        ac(MainWrapper, ac(column, ac(card, ac(CardBottom, ac(UnitCost, CostIcon)))));
        ac(UnitCost, Price);

        //LocalStorage Troops Incrementation

        function TroopIncrement(id) {
            if (AddTroopProcess(PlayerData.Troops["Troop" + id], SelectMultiplier) <= 10) {
                PlayerData.Troops["Troop" + id] += SelectMultiplier;
                CardRefresh()
            } else {
                return;
            }
        }

        function checkCard() {
            var TroopRecruited = false;
            var SelectedPrice = MultProcess(data.price, SelectMultiplier)
            if (AddTroopProcess(PlayerData.Troops["Troop" + data.id], SelectMultiplier) > 10) {
                card.className = "card brightness";
            } else if ((PlayerData.Currency.Gold - SelectedPrice) > 0 && TroopRecruited == false && AddTroopProcess(PlayerData.Troops["Troop" + data.id], SelectMultiplier) <= 10) {
                console.log(PlayerData.Troops)
                PlayerData.Currency.Gold -= SelectedPrice;
                TroopIncrement(data.id);
                DataObject.updateData();
                TroopRecruited = true;
                return;
            }
        }
        card.addEventListener("click", checkCard);
    });

    function AddTroopProcess(id, SelectMultiplier) {
        return id + SelectMultiplier;
    }

    function MultProcess(num1, num2) {
        return num1 * num2;
    }

    function CardRefresh() {
        var card = document.getElementsByClassName("card");
        var Price = document.getElementsByName("Price");

        for (let i = 0; i < card.length; i++) {

            var SelectedPrice = MultProcess(minionsData[i].price, SelectMultiplier)
            Price[i].textContent = SelectedPrice;

            if ((PlayerData.Currency.Gold - Price[i].textContent) < 0 || AddTroopProcess(PlayerData.Troops["Troop" + minionsData[i].id], SelectMultiplier) > 10) {

                card[i].className = "card brightness";

            } else {
                card[i].className = "card"
            }
        }
    }
}