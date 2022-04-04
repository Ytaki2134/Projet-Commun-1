import * as apiUtilities from "./utilities/apiUtilities.js";

const minionsData = await apiUtilities.getMinions();

console.log(minionsData);

let MainWrapper = document.getElementById("Card-Wrapper");

minionsData.forEach(function(data, index) {

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