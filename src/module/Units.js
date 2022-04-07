import Data from "../utilities/dataHandling.js";
import * as apiUtilities from "../utilities/apiUtilities.js"

const minionsData = await apiUtilities.getMinions();
let SelectMultiplier = 1;

function AddTroopProcess(id, SelectMultiplier) {
    return id + SelectMultiplier;
}

function MultProcess(num1, num2) {
    return num1 * num2;
}

export default class Units{
    constructor(){
        this.DataObject = new Data();
        this.PlayerData = this.DataObject.getData();
    }

    main(){
        this.Currency = document.getElementById("Currency-Counter");

        let RecruitMenu = document.getElementById('Recruit-Menu')

        window.Game.Frames.MenuTrigger.on('pointerup', () => {
            console.log("?");
            if (RecruitMenu && RecruitMenu.style.display === 'none') {
                RecruitMenu.style.display = 'block';
                console.log(RecruitMenu.style.display);
                window.Game.Frames.Menu2.setVisible = true;
                window.Game.DataObject.updateData();
                this.CardRefresh();
            }
        });

        document.onclick = function (checkHit) {
            var hit = checkHit.target;
            if (hit.tagName == 'CANVAS' && RecruitMenu.style.display === 'block') {
                RecruitMenu.style.display = 'none';
                window.Game.Frames.Menu2.setVisible = false;
            }
        };

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
                if (AddTroopProcess(window.Game.PlayerData.Troops["Troop" + id], SelectMultiplier) <= 10) {
                    window.Game.PlayerData.Troops["Troop" + id] += SelectMultiplier;
                    console.log("?");
                    console.log(MainWrapper);
                    CardRefresh()
                } else {
                    return;
                }
            }

            function checkCard() {
                var TroopRecruited = false;
                var SelectedPrice = MultProcess(data.price, SelectMultiplier)
                console.log(data.price, SelectMultiplier);
                console.log("Omg here");
                console.log(SelectedPrice);
                if (AddTroopProcess(window.Game.PlayerData.Troops["Troop" + data.id], SelectMultiplier) > 10) {
                    card.className = "card brightness";
                } else if ((window.Game.PlayerData.Currency.Gold - SelectedPrice) > 0 && TroopRecruited == false && AddTroopProcess(window.Game.PlayerData.Troops["Troop" + data.id], SelectMultiplier) <= 10) {
                    console.log(window.Game.PlayerData.Troops)
                    window.Game. PlayerData.Currency.Gold -= SelectedPrice;
                    TroopIncrement(data.id);
                    window.Game.DataObject.updateData();
                    TroopRecruited = true;
                    return;
                }
            }
            card.addEventListener("click", checkCard);
        });
    }

    CardRefresh() {
        var card = document.getElementsByClassName("card");
        var Price = document.getElementsByName("Price");

        for (let i = 0; i < card.length; i++) {

            var SelectedPrice = MultProcess(minionsData[i].price, SelectMultiplier)
            Price[i].textContent = SelectedPrice;

            if ((window.Game.PlayerData.Currency.Gold - Price[i].textContent) < 0 || AddTroopProcess(window.Game.PlayerData.Troops["Troop" + minionsData[i].id], SelectMultiplier) > 10) {

                card[i].className = "card brightness";

            } else {
                card[i].className = "card"
            }
        }
    }
}