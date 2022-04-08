import * as apiUtilities from "./utilities/apiUtilities.js";
import { checkBuilding, DataObject, enableAll, PlayerData } from "./module/building.js"
import { displayMaterials } from "./module/materials.js"

const attractions = await apiUtilities.getAttractions();
const minionsData = await apiUtilities.getMinions();
let Currency = document.getElementById("Currency-Counter");
let Currency2 = document.getElementById("Exp-Currency-Counter")

function update() {
    if (Date.now() - PlayerData.lastAward > 1000) {
        PlayerData.lastAward = Date.now();
        let gold = 0;
        for (const [key, value] of Object.entries(PlayerData.UnlockedBuildings)) {
            gold += attractions[value - 1].rendings;
        }

        PlayerData.Currency.Gold += gold

        var CurrentGold = PlayerData.Currency.Gold;
        if (PlayerData.Currency.Gold > 1000000) {
            CurrentGold = (PlayerData.Currency.Gold / 1000000).toFixed(2) + " M"
        } else if (PlayerData.Currency.Gold > 1000) {
            CurrentGold = (PlayerData.Currency.Gold / 1000).toFixed(2) + " K"
        }

        document.getElementById("money").innerHTML = CurrentGold;
        document.getElementById("rendings-amount").innerHTML = gold + "/sec"
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
    this.load.image('popup2', 'image/donjon-parchemin.png');
    this.load.image('popupTrigger2', 'image/parchemin_menu.png');
    this.load.image('stable', 'image/construction.png');
    this.load.image('materialButton', 'image/parchemin1.png');
    this.load.image('kamos', 'image/parchemin2.png');
    this.load.image('pop', 'image/parchemin3.png');
    this.load.image('close', 'image/close_button.png');
    this.load.image('switchMenu', 'image/button.png');
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

    let popupMaterials = this.add.image(600, 400, 'popup2')
    popupMaterials.setScale(1.125)
    popupMaterials.setDepth(5)
    popupMaterials.setVisible(false)

    let closeButton = this.add.image(950, 200, 'close')
    closeButton.setScale(.40)
    closeButton.setDepth(6)
    closeButton.setVisible(false)

    let popup = [[popupWindow, popupStable, closeButton], [popupMaterials, closeButton]]
    let popupsHtml = document.getElementsByClassName("popup")

    closeButton.setInteractive().on('pointerdown', () => {
        popup.forEach(element => (
            element.forEach(child => {
                child.setVisible(false);
            })
        ))
        for (let i = 0; i < popupsHtml.length; i++) {
            popupsHtml[i].style.display = "none"

        }
        enableAll();
    })

    let materialButton = this.add.image(525, 50, 'materialButton');
    let kamos = this.add.image(325, 50, 'kamos');
    let population = this.add.image(125, 50, 'pop');

    let MenuTrigger = this.add.image(160, 730, 'popupTrigger2').setInteractive();
    MenuTrigger.setScale(0.35);

    let switchButton = document.getElementById("Switch-Button");
    let ExpswitchButton = document.getElementById("Exp-Switch-Button");

    switchButton.onclick = function () {
        if (RecruitMenu.style.display === 'block') {
            RecruitMenu.style.display = 'none';
            ExpeditionMenu.style.display = 'block';
        } else if (ExpeditionMenu.style.display === 'block') {
            ExpeditionMenu.style.display = 'none';
            RecruitMenu.style.display = 'block';
        }
    };

    ExpswitchButton.onclick = function () {
        if (RecruitMenu.style.display === 'block') {
            RecruitMenu.style.display = 'none';
            ExpeditionMenu.style.display = 'block';
        } else if (ExpeditionMenu.style.display === 'block') {
            ExpeditionMenu.style.display = 'none';
            RecruitMenu.style.display = 'block';
        }
    };

    let ressources = [materialButton, kamos, population]

    ressources.forEach(element => {
        element.setScale(.45).setDepth(2).setInteractive().on('pointerdown', () => (displayMaterials(popup)))
    })

    attractions.forEach(obj => {
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
            attractions.forEach(obj => {
                if (element == obj.id) {
                    obj.status = "alreadyBuilt";
                    window[obj.name].setFrame(1);
                }
            });
        })
    }

    let pos = 0;
    for (const [key, value] of Object.entries(PlayerData.Currency)) {

        DataObject.On(key, function (newValue) {

            if (key === "Gold") {
                Currency.innerHTML = PlayerData.Currency.Gold;
                Currency2.innerHTML = PlayerData.Currency.Gold;
            }
            if (key === "Crystals") {
                //ICI update le text
            }
        })
    }

    Currency.textContent += PlayerData.Currency.Gold;
    Currency2.textContent += PlayerData.Currency.Gold;

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

    Currency2.addEventListener('DOMSubtreeModified', function () {
        var MutationObserver = window.MutationObserver
            || window.WebKitMutationObserver
            || window.MozMutationObserver;
        var observer = new MutationObserver(function () {
            CardRefresh();
        });
        observer.observe(Currency2, { childList: true });
    });

    let RecruitMenu = document.getElementById('Recruit-Container')
    let ExpeditionMenu = document.getElementById('Expedition-Container')

    MenuTrigger.on('pointerup', () => {

        if (RecruitMenu && RecruitMenu.style.display === 'none') {

            RecruitMenu.style.display = 'block';
            DataObject.updateData();
            CardRefresh();

        }
    });

    //Closing System for Recruit Menu

    document.onclick = function (checkHit) {
        var hit = checkHit.target;
        if (hit.tagName == 'CANVAS' && RecruitMenu.style.display === 'block' || hit.tagName == 'CANVAS' && ExpeditionMenu.style.display) {
            RecruitMenu.style.display = 'none';
            ExpeditionMenu.style.display = 'none';
        }
    };

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

    //Automated Generation of Recruit Cards 

    let MainWrapper = document.getElementById("Card-Wrapper");
    let ExpMainWrapper = document.getElementById("Exp-Card-Wrapper");

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

        var column2 = create("div", {
            className: "column"
        });

        var card2 = create("div", {
            className: "card",
            id: "card"
        });

        var cardImage2 = create("img", {
            className: "Card-Image",
            src: data.image,
            alt: "Portrait"
        });

        var CardBottom2 = create("div", {
            className: "Card-Bottom flex"
        });

        var UnitCost2 = create("div", {
            className: "Unit-Cost"
        });

        var CostIcon2 = create("img", {
            className: "Cost-Icon",
            src: "image/3bf2be9160f1cd10cb04c3fb3gfdggdsggfdedb5c4_2.png",
            alt: "Currency Icon"
        });

        var Price2 = create("h3", {
            className: "h-null",
            id: "Unit-Cost",
        })

        card.setAttribute("name", "card");
        Price.setAttribute("name", "Price");
        Price.textContent += data.price;
        card2.setAttribute("name", "card2")
        Price2.setAttribute("name", "Price2");
        Price2.textContent += data.price;

        //Defining div's children

        ac(MainWrapper, ac(column, ac(card, cardImage)));
        ac(MainWrapper, ac(column, ac(card, ac(CardBottom, ac(UnitCost, CostIcon)))));
        ac(UnitCost, Price);
        ac(ExpMainWrapper, ac(column2, ac(card2, cardImage2)));
        ac(ExpMainWrapper, ac(column2, ac(card2, ac(CardBottom2, ac(UnitCost2, CostIcon2)))));
        ac(UnitCost2, Price2);

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
        card2.addEventListener("click", checkCard);
    });

    function AddTroopProcess(id, SelectMultiplier) {
        return id + SelectMultiplier;
    }

    function MultProcess(num1, num2) {
        return num1 * num2;
    }

    function CardRefresh() {
        var card = document.getElementsByName("card");
        var card2 = document.getElementsByName("card2");
        var Price = document.getElementsByName("Price");
        var Price2 = document.getElementsByName("Price2");

        for (let i = 0; i < card.length; i++) {

            let ProcessPrice = minionsData[i].price;
            var SelectedPrice = MultProcess(ProcessPrice, SelectMultiplier);
            Price[i].textContent = SelectedPrice;

            if ((PlayerData.Currency.Gold - Price[i].textContent) < 0 || AddTroopProcess(PlayerData.Troops["Troop" + minionsData[i].id], SelectMultiplier) > 10) {

                card[i].className = "card brightness";

            } else {
                card[i].className = "card"
            }
        }

        for (let i = 0; i < card2.length; i++) {

            let ProcessPrice = minionsData[i].price;
            var SelectedPrice = MultProcess(ProcessPrice, SelectMultiplier);
            Price2[i].textContent = SelectedPrice;

            if ((PlayerData.Currency.Gold - Price2[i].textContent) < 0 || AddTroopProcess(PlayerData.Troops["Troop" + minionsData[i].id], SelectMultiplier) > 10) {

                card2[i].className = "card brightness";

            } else {
                card2[i].className = "card"
            }
        }
    }
}
