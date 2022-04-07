import Data from "../utilities/dataHandling.js";
import * as apiUtilities from "../utilities/apiUtilities.js";

const attractions = await apiUtilities.getAttractions();
let selectedBuilding;

export default class Buildings{
    constructor(){
        this.DataObject = new Data();
        this.PlayerData = this.DataObject.getData();
    }

    main(popup){
        this.popupImage = popup

        //placing all buildings on the map
        attractions.forEach(obj => {
            console.log(obj.name);
            window[obj.name] = window.Game.add.sprite(    
                obj.pos_x,
                obj.pos_y,
                obj.image);
            window[obj.name].setInteractive().on('pointerdown', () => this.checkBuilding(obj));
            window[obj.name].setFrame(0);
        });
    
        if (this.PlayerData.UnlockedBuildings != [])
        {
            this.PlayerData.UnlockedBuildings.forEach(element => {
                 attractions.forEach(obj => {
                     if (element == obj.id)
                     {
                        obj.status = "alreadyBuilt";
                        window[obj.name].setFrame(1);
                     }
                }); 
            })
        }
    }
    
    disableAll() // function to restrain the user from clicking on other popups while in a popup
    {
        attractions.forEach(obj => (
            window[obj.name].disableInteractive()
        ));
    }

    enableAll() // function to allow the user to click on popups
    {
        attractions.forEach(obj => (
            window[obj.name].setInteractive()
        ));
    }

    checkBuilding(building) //get buildings info
    {  
        selectedBuilding = building.id;
        switch (building.status){
            case "build":
                this.displayBuildWindow(building, selectedBuilding);
                break;
            case "alreadyBuilt":
                this.displayDetails(building);
                break;
        }
    }

    expedition(dungeon, popup) {

        document.getElementById("expedition").style.display = "none"
        PlayerData.dungeonEnd = Date.now() + dungeon.expedition_time * 1000;
        everysecond = setInterval(countdown, second);
    
    }

    displayDetails(building) {

        let expeditionButton = document.getElementById("expedition")
        let popupDetails = document.getElementById("details");
    
        this.popupImage[0][0].setVisible(true);
        this.popupImage[0][2].setVisible(true);
    
        popupDetails.style.display = 'block';
    
        document.getElementById("name-details").innerHTML = building.name;
        document.getElementById("image-details").src = building.image_src;
        document.getElementById("rendings-details").innerHTML = "Rendings : " + building.rendings + " Gold per second";
    
        expeditionButton.addEventListener('click', () => {
            this.expedition(building, this.popupImage[0][0]);
        })
        if (building.name == "dungeon") {
            expeditionButton.style.display = 'block'
        }
    }

    verify(materialsToHave) {
        let verification = []
        for (const [key, value] of Object.entries(materialsToHave)) {
            if (materialsToHave[key] <= this.PlayerData.Materials[key]) {
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

    construire(building, selectedBuilding){
    
        let prix = building.price;
        let materialsToHave = building.materials

        if (this.PlayerData.Currency.Gold >= prix && this.PlayerData.UnlockedBuildings.includes(building.id) == false && verify(materialsToHave) == true) {

            if (building.id == selectedBuilding) { // ici
                this.PlayerData.Currency.Gold -= prix;

                for (var key in this.PlayerData.Materials) {
                    let newValue = this.PlayerData.Materials[key] - building.materials[key]
                    this.PlayerData.Materials[key] = newValue;
                }
                window[building.name].setFrame(1);
                building.status = "alreadyBuilt";
                this.PlayerData.UnlockedBuildings.push(building.id);
                this.DataObject.updateData();
            }
        }
        this.enableAll();
    
    }

    displayBuildWindow (building,selectedBuilding)
    {
        this.disableAll();
        let buildPopup = this.popupImage[0]

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
}

// var count;
// let everysecond;

// function countdown() {
//     if (count <= 0) {
//         console.log("Expedition terminated");

//         document.getElementById("expedition").style.display = "block"
//         document.getElementById("time").innerHTML = "";

//         //clear function

//         clearInterval(everysecond);
//         count = Date.now()
//         return;
//     }
//     else {
//         count = PlayerData.dungeonEnd - Date.now()
//         const days = Math.floor(count / day)
//         const hours = Math.floor((count % day) / hour)
//         const minutes = Math.floor((count % hour) / minute)
//         const seconds = Math.floor((count % minute) / second)
//         document.getElementById("time").innerHTML = days + ":" + hours + ":" + minutes + ":" + seconds;
//     }
// }