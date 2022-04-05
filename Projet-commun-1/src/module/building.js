import Data from "../utilities/dataHandling.js";
import * as apiUtilities from "../utilities/apiUtilities.js";
//hi
const attractions = await apiUtilities.getAttractions();


let DataObject = new Data();
let PlayerData = DataObject.getData();
let selectedBuilding = null;




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

function checkBuilding(building)
{  
    selectedBuilding = building.id;
    switch (building.status){
        case "build":
            displayBuildWindow(building, selectedBuilding);
            break;
        case "alreadyBuilt":
            displayDetails(building);
            break;
    }
}

function construire(building){
    
    let prix = building.price;
    if (PlayerData.Currency.Gold >= prix && PlayerData.UnlockedBuildings.includes(building.id) == false )
    {
        PlayerData.Currency.Gold -= prix;
        if (building.id == selectedBuilding){
            window[building.name].setFrame(1);
            building.status = "alreadyBuilt";
            PlayerData.UnlockedBuildings.push(building.id);
            DataObject.updateData();
        } 
    }
    else
    {
        return;
    }
    enableAll();

}
function displayBuildWindow (building,selectedBuilding)
{
    
    disableAll();
    let popup = document.getElementById('construction');
    if (popup && popup.style.display === 'none' ){
        popup.style.display = 'block';
    }
    let buildButton = document.getElementById("build-button");
    buildButton.addEventListener("click", () => {
        construire(building,buildButton,selectedBuilding);
        popup.style.display = "none";
    })

    document.getElementById("price").innerHTML = "Price : " + building.price + " Gold";
    document.getElementById("name").innerHTML = building.name;
    document.getElementById("rendings").innerHTML = "Rendings : " + building.rendings + " Gold per second";

    let closeButton = document.getElementById("close");
    closeButton.addEventListener("click", () => {
        popup.style.display = 'none';
        enableAll();
    })
    

}   

function displayDetails(building)
{
    
    let popupDetails = document.getElementById("details");
    popupDetails.style.display = 'block' ;

    document.getElementById("name-details").innerHTML = building.name;
    document.getElementById("image-details").src = building.image_src;
    document.getElementById("rendings-details").innerHTML = "Rendings : " + building.rendings + " Gold per second";
 
    let closeDetailsButton = document.getElementById("close-details");
    closeDetailsButton.addEventListener("click", () => (
        popupDetails.style.display = 'none'    
    ))
}

export {checkBuilding, DataObject, PlayerData};