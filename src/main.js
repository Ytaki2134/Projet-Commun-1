import Data from "./utilities/dataHandling.js";
import * as apiUtilities from "./utilities/apiUtilities.js";
import { MAX_ZOOM, MIN_ZOOM, LAYERS } from "./utilities/global.js";
import Buildings from "./module/building.js";
import Game from "./game.js";

new Game();

// const attractions = await apiUtilities.getAttractions();
// const minionsData = await apiUtilities.getMinions();
// let Currency = document.getElementById("Currency-Counter");



// function create() {

//     let popupWindow = this.add.image(600, 400, 'popup');
//     popupWindow.setScale(0.40)
//     popupWindow.setDepth(5)
//     popupWindow.setVisible(false)

//     let popupStable = this.add.image(600, 700, 'stable')
//     popupStable.setScale(0.40)
//     popupStable.setDepth(5)
//     popupStable.setVisible(false)

//     let popupMaterials = this.add.image(600, 400, 'popup2')
//     popupMaterials.setScale(1.125)
//     popupMaterials.setDepth(5)
//     popupMaterials.setVisible(false)

//     let closeButton = this.add.image(950, 200, 'close')
//     closeButton.setScale(.40)
//     closeButton.setDepth(6)
//     closeButton.setVisible(false)

//     let popup = [[popupWindow, popupStable, closeButton], [popupMaterials, closeButton]]
//     let popupsHtml = document.getElementsByClassName("popup")

//     closeButton.setInteractive().on('pointerdown', () => {
//         popup.forEach(element => (
//             element.forEach(child => {
//                 child.setVisible(false);
//             })
//         ))
//         for (let i = 0; i < popupsHtml.length; i++) {
//             popupsHtml[i].style.display = "none"

//         }
//         enableAll();
//     })

//     closeButton.setInteractive().on('pointerdown', () => { return; })

//     let materialButton = this.add.image(125, 50, 'materialButton');
//     let kamos = this.add.image(325, 50, 'kamos');
//     let population = this.add.image(525, 50, 'pop');

//     let MenuTrigger = this.add.image(160, 730, 'popupTrigger2').setInteractive();
//     MenuTrigger.setScale(0.35);
//     let Menu2 = this.add.image(600, 400, 'popup2');
//     Menu2.setVisible(false);

//     let ressources = [materialButton, kamos, population]

//     ressources.forEach(element => {
//         element.setScale(.45).setDepth(2).setInteractive().on('pointerdown', () => (displayMaterials(popup)))
//     })

//     attractions.forEach(obj => {
//         window[obj.name] = this.add.sprite(
//             obj.pos_x,
//             obj.pos_y,
//             obj.image);
//         window[obj.name].setInteractive().on('pointerdown', () => checkBuilding(obj, popup));
//         window[obj.name].setFrame(0);
//         window[obj.name].setScale(.30);


//     });

//     if (PlayerData.UnlockedBuildings != []) {
//         PlayerData.UnlockedBuildings.forEach(element => {
//             attractions.forEach(obj => {
//                 if (element == obj.id) {
//                     obj.status = "alreadyBuilt";
//                     window[obj.name].setFrame(1);
//                 }
//             });
//         })
//     }

//     let pos = 0;
//     for (const [key, value] of Object.entries(PlayerData.Currency)) {

//         DataObject.On(key, function (newValue) {

//             if (key === "Gold") {
//                 Currency.innerHTML = PlayerData.Currency.Gold;
//             }
//             if (key === "Crystals") {
//                 //ICI update le text
//             }
//         })
//     }

//     Currency.textContent += PlayerData.Currency.Gold;

//     setTimeout(() => {
//         PlayerData.Currency.Gold += 1; //set value
//         DataObject.updateData(); //update
//     }, 2000);

//     Currency.addEventListener('DOMSubtreeModified', function () {
//         var MutationObserver = window.MutationObserver
//             || window.WebKitMutationObserver
//             || window.MozMutationObserver;
//         var observer = new MutationObserver(function () {
//             CardRefresh();
//         });
//         observer.observe(Currency, { childList: true });
//     });

//     let RecruitMenu = document.getElementById('Recruit-Menu')

//     MenuTrigger.on('pointerup', () => {

//         if (RecruitMenu && RecruitMenu.style.display === 'none') {

//             RecruitMenu.style.display = 'block';
//             Menu2.setVisible = true;
//             DataObject.updateData();
//             CardRefresh();

//         }
//     });

//     //Closing System for Recruit Menu

//     document.onclick = function (checkHit) {
//         var hit = checkHit.target;
//         if (hit.tagName == 'CANVAS' && RecruitMenu.style.display === 'block') {
//             RecruitMenu.style.display = 'none';
//             Menu2.setVisible = false;
//         }
//     };

//     var Selections = document.getElementsByClassName('Quantity-Font h-null');

//     var SelectMultiplier = 1;

//     for (let i = 0; i < Selections.length; i++) {
//         Selections[i].addEventListener("click", (checkSelect) => {
//             var Selected = document.getElementsByClassName('Quantity-Font h-null Select-Quantity');
//             if (Selected[0] != null) {
//                 Selected[0].classList.remove("Select-Quantity");
//             }
//             var Selection = checkSelect.target;

//             switch (Selection.id) {
//                 case "First-Select":
//                     Selection.className = "Quantity-Font h-null Select-Quantity";
//                     SelectMultiplier = 1;
//                     CardRefresh();
//                     break;
//                 case "Second-Select":
//                     Selection.className = "Quantity-Font h-null Select-Quantity";
//                     SelectMultiplier = 10;
//                     CardRefresh();
//                     break;
//                 default:
//                     console.log("Error, something happened during selection")
//             }
//         })
//     }

//     //Automated Generation of Recruit Cards 

//     let MainWrapper = document.getElementById("Card-Wrapper");

//     minionsData.forEach(function (data, index) {

//         function create(tagName, props) {
//             return Object.assign(document.createElement(tagName), (props || {}));
//         }

//         function ac(p, c) {
//             if (c) p.appendChild(c);
//             return p;
//         }

//         var column = create("div", {
//             className: "column"
//         });

//         var card = create("div", {
//             className: "card",
//             id: "card"
//         });

//         var cardImage = create("img", {
//             className: "Card-Image",
//             src: data.image,
//             alt: "Portrait"
//         });

//         var CardBottom = create("div", {
//             className: "Card-Bottom flex"
//         });

//         var UnitCost = create("div", {
//             className: "Unit-Cost"
//         });

//         var CostIcon = create("img", {
//             className: "Cost-Icon",
//             src: "image/3bf2be9160f1cd10cb04c3fb3gfdggdsggfdedb5c4_2.png",
//             alt: "Currency Icon"
//         });

//         var Price = create("h3", {
//             className: "h-null",
//             id: "Unit-Cost",
//         })

//         Price.setAttribute("name", "Price")
//         Price.textContent += data.price;

//         //Defining div's children

//         ac(MainWrapper, ac(column, ac(card, cardImage)));
//         ac(MainWrapper, ac(column, ac(card, ac(CardBottom, ac(UnitCost, CostIcon)))));
//         ac(UnitCost, Price);

//         //LocalStorage Troops Incrementation

//         function TroopIncrement(id) {
//             if (AddTroopProcess(PlayerData.Troops["Troop" + id], SelectMultiplier) <= 10) {
//                 PlayerData.Troops["Troop" + id] += SelectMultiplier;
//                 CardRefresh()
//             } else {
//                 return;
//             }
//         }

//         function checkCard() {
//             var TroopRecruited = false;
//             var SelectedPrice = MultProcess(data.price, SelectMultiplier)
//             if (AddTroopProcess(PlayerData.Troops["Troop" + data.id], SelectMultiplier) > 10) {
//                 card.className = "card brightness";
//             } else if ((PlayerData.Currency.Gold - SelectedPrice) > 0 && TroopRecruited == false && AddTroopProcess(PlayerData.Troops["Troop" + data.id], SelectMultiplier) <= 10) {
//                 console.log(PlayerData.Troops)
//                 PlayerData.Currency.Gold -= SelectedPrice;
//                 TroopIncrement(data.id);
//                 DataObject.updateData();
//                 TroopRecruited = true;
//                 return;
//             }
//         }
//         card.addEventListener("click", checkCard);
//     });

    
// }