import Data from "../utilities/dataHandling.js";
import * as apiUtilities from "../utilities/apiUtilities.js"
import { displayMaterials } from "./materials.js";

const minionsData = await apiUtilities.getMinions();
let Currency = document.getElementById("Currency-Counter");
let Currency2 = document.getElementById("Exp-Currency-Counter")
let SelectMultiplier = 1;

function AddTroopProcess(id, SelectMultiplier) {
    return id + SelectMultiplier;
}

function MultProcess(num1, num2) {
    return num1 * num2;
}

export default class Units {
    constructor() {
        this.DataObject = new Data();
        this.PlayerData = this.DataObject.getData();
    }

    main(popup) {
        this.Currency = document.getElementById("Currency-Counter");
        this.Currency2 = document.getElementById("Exp-Currency-Counter")

        this.Currency.textContent += this.PlayerData.Currency.Gold;
        this.Currency2.textContent += this.PlayerData.Currency.Gold;

        let switchButton = document.getElementById("Switch-Button");
        let ExpswitchButton = document.getElementById("Exp-Switch-Button");
        let RecruitMenu = document.getElementById('Recruit-Container')
        let ExpeditionMenu = document.getElementById('Expedition-Container')
        let MenuTrigger = document.getElementById('MenuTrigger')
        let Materials = document.getElementById('materials-amount')

        Materials.onclick = displayMaterials(popup);

        MenuTrigger.onclick = function () {
            if(RecruitMenu && RecruitMenu.style.display === 'none') {
                RecruitMenu.style.display = 'block';
                window.Game.DataObject.updateData();
                CardRefresh();
            } else if (RecruitMenu && RecruitMenu.style.display === 'block') {
                RecruitMenu.style.display = 'none';
                window.Game.DataObject.updateData();
                CardRefresh();
            }
        }

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

        document.onclick = function (checkHit) {
            var hit = checkHit.target;
            if (hit.tagName == 'CANVAS' && RecruitMenu.style.display === 'block') {
                RecruitMenu.style.display = 'none';
                window.Game.Frames.Menu2.setVisible = false;
            }
        };

        this.Currency.addEventListener('DOMSubtreeModified', function () {
            var MutationObserver = window.MutationObserver
                || window.WebKitMutationObserver
                || window.MozMutationObserver;
            var observer = new MutationObserver(function () {
                CardRefresh();
            });
            observer.observe(Currency, { childList: true });
        });

        this.Currency2.addEventListener('DOMSubtreeModified', function () {
            var MutationObserver = window.MutationObserver
                || window.WebKitMutationObserver
                || window.MozMutationObserver;
            var observer = new MutationObserver(function () {
                CardRefresh();
            });
            observer.observe(Currency2, { childList: true });
        });

        var Selections = document.getElementsByClassName('Quantity-Font h-null');
        const CardRefresh = this.CardRefresh;

        for (let i = 0; i < Selections.length; i++) {
            Selections[i].addEventListener("click", (checkSelect) => {
                var Selected = document.getElementsByClassName('Quantity-Font h-null Select-Quantity');
                if (Selected[0] != null) {
                    Selected[0].classList.remove("Select-Quantity");
                }
                var Selection = checkSelect.target;

                this.SelectMultiplier = Selection.id == "First-Select" && 1 || 10
                this.CardRefresh();
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
                if (AddTroopProcess(window.Game.PlayerData.Troops["Troop" + id], SelectMultiplier) <= 10) {
                    window.Game.PlayerData.Troops["Troop" + id] += SelectMultiplier;
                    CardRefresh()
                } else {
                    return;
                }
            }

            function checkCard() {
                var TroopRecruited = false;
                var SelectedPrice = MultProcess(data.price, SelectMultiplier)
                console.log(window.Game.PlayerData.Troops);
                if (AddTroopProcess(window.Game.PlayerData.Troops["Troop" + data.id], SelectMultiplier) > 10) {
                    card.className = "card brightness";
                } else if ((window.Game.PlayerData.Currency.Gold - SelectedPrice) > 0 && TroopRecruited == false && AddTroopProcess(window.Game.PlayerData.Troops["Troop" + data.id], SelectMultiplier) <= 10) {
                    console.log(window.Game.PlayerData.Troops)
                    window.Game.PlayerData.Currency.Gold -= SelectedPrice;
                    TroopIncrement(data.id);
                    window.Game.DataObject.updateData();
                    TroopRecruited = true;
                    return;
                }
            }
            card.addEventListener("click", checkCard);
            card2.addEventListener("click", checkCard);
        });
    }

    CardRefresh() {
        var card = document.getElementsByName("card");
        var card2 = document.getElementsByName("card2");
        var Price = document.getElementsByName("Price");
        var Price2 = document.getElementsByName("Price2");

        for (let i = 0; i < card.length; i++) {

            let ProcessPrice = minionsData[i].price;
            var SelectedPrice = MultProcess(ProcessPrice, SelectMultiplier);
            Price[i].textContent = SelectedPrice;
            console.log();
            if ((window.Game.PlayerData.Currency.Gold - Price[i].textContent) < 0 || AddTroopProcess(window.Game.PlayerData.Troops["Troop" + minionsData[i].id], SelectMultiplier) > 10) {

                card[i].className = "card brightness";

            } else {
                card[i].className = "card"
            }
        }

        for (let i = 0; i < card2.length; i++) {

            let ProcessPrice = minionsData[i].price;
            var SelectedPrice = MultProcess(ProcessPrice, SelectMultiplier);
            Price2[i].textContent = SelectedPrice;

            if ((window.Game.PlayerData.Currency.Gold - Price2[i].textContent) < 0 || AddTroopProcess(window.Game.PlayerData.Troops["Troop" + minionsData[i].id], SelectMultiplier) > 10) {

                card2[i].className = "card brightness";

            } else {
                card2[i].className = "card"
            }
        }
    }
}