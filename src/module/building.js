import Data from "../utilities/dataHandling.js";
import * as apiUtilities from "../utilities/apiUtilities.js";
//hi
const attractions = await apiUtilities.getAttractions();


let DataObject = new Data();
let PlayerData = DataObject.getData();
let selectedBuilding = null; // ici

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;



function disableAll() // function to restrain the user from clicking on other popups while in a popup
{
    attractions.forEach(obj => (
        window[obj.name].disableInteractive()
    ));
}

function enableAll() // function to allow the user to click on popups
{
    attractions.forEach(obj => (
        window[obj.name].setInteractive()
    ));
}

function checkBuilding(building, popupImage) {
    selectedBuilding = building.id; // ici
    switch (building.status) {
        case "build":
            displayBuildWindow(building, selectedBuilding, popupImage); // ici
            break;
        case "alreadyBuilt":
            displayDetails(building, popupImage);
            break;
    }
}
function verify(materialsToHave) {
    let verification = []
    for (const [key, value] of Object.entries(materialsToHave)) {
        if (materialsToHave[key] <= PlayerData.Materials[key]) {
            verification.push("true");
        }
        else {
            verification.push("false")
        }
    }
    if (verification.includes("false")) {
        return false
    }
    else {
        return true
    }
}
function construire(building, selectedBuilding) {

    let prix = building.price;
    let materialsToHave = building.materials

    if (PlayerData.Currency.Gold >= prix && PlayerData.UnlockedBuildings.includes(building.id) == false && verify(materialsToHave) == true) {

        if (building.id == selectedBuilding) { // ici
            PlayerData.Currency.Gold -= prix;

            for (var key in PlayerData.Materials) {
                let newValue = PlayerData.Materials[key] - building.materials[key]
                PlayerData.Materials[key] = newValue;
            }
            window[building.name].setFrame(1);
            building.status = "alreadyBuilt";
            PlayerData.UnlockedBuildings.push(building.id);
            DataObject.updateData();
        }
    }
    enableAll();
}

function displayBuildWindow(building, selectedBuilding, popupImage) {

    disableAll();
    let buildPopup = popupImage[0]

    buildPopup.forEach(element => element.setVisible(true))
    let popup = document.getElementById('construction');
    if (popup && popup.style.display === 'none') {
        popup.style.display = 'block';
    }
    let buildButton = document.getElementById("build-button");
    buildButton.addEventListener("click", () => {
        construire(building, selectedBuilding);
        buildPopup.forEach(element => element.setVisible(false))
        popup.style.display = "none";
    })

    let materialDisplay = ""
    for (const [key, value] of Object.entries(building.materials)) {
        materialDisplay += value + " " + key + " "
    }

    document.getElementById("price").innerHTML = "Price : " + building.price + " Gold";
    document.getElementById("materials").innerHTML = materialDisplay;
    document.getElementById("name").innerHTML = building.name;
    document.getElementById("rendings").innerHTML = "Rendings : " + building.rendings + " Gold per second";

}

var count;
let everysecond;

function countdown() {
    if (count <= 0) {
        console.log("Expedition terminated");

        document.getElementById("expedition").style.display = "block"
        document.getElementById("time").innerHTML = "";

        //clear function

        clearInterval(everysecond);
        count = Date.now()
        return;
    }
    else {
        count = PlayerData.dungeonEnd - Date.now()
        const days = Math.floor(count / day)
        const hours = Math.floor((count % day) / hour)
        const minutes = Math.floor((count % hour) / minute)
        const seconds = Math.floor((count % minute) / second)
        document.getElementById("time").innerHTML = days + ":" + hours + ":" + minutes + ":" + seconds;
    }
}

function expedition(dungeon, popup) {

    document.getElementById("expedition").style.display = "none"
    PlayerData.dungeonEnd = Date.now() + dungeon.expedition_time * 1000;
    everysecond = setInterval(countdown, second);

}

function displayDetails(building, popupImage) {

    let expeditionButton = document.getElementById("expedition")
    let popupDetails = document.getElementById("details");

    popupImage[0][0].setVisible(true);
    popupImage[0][2].setVisible(true);

    popupDetails.style.display = 'block';

    document.getElementById("name-details").innerHTML = building.name;
    document.getElementById("image-details").src = building.image_src;
    document.getElementById("rendings-details").innerHTML = "Rendings : " + building.rendings + " Gold per second";

    expeditionButton.addEventListener('click', () => {
        expedition(building, popupImage[0][0]);
    })
    if (building.name == "dungeon") {
        expeditionButton.style.display = 'block'
    }
}

export { checkBuilding, enableAll, disableAll, DataObject, PlayerData };
