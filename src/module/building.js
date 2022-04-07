import Data from "../utilities/dataHandling.js";
import * as apiUtilities from "../utilities/apiUtilities.js";

const attractions = await apiUtilities.getAttractions();
let selectedBuilding;

export default class Buildings{
    constructor(data){
        this.DataObject = new Data();
        this.PlayerData = this.DataObject.getData();
    }

    main(){
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

    construire(building){
    
        let prix = building.price;
        if (this.PlayerData.Currency.Gold >= prix && this.PlayerData.UnlockedBuildings.includes(building.id) == false )
        {
            this.PlayerData.Currency.Gold -= prix;
            if (building.id == selectedBuilding){
                window[building.name].setFrame(1);
                building.status = "alreadyBuilt";
                this.PlayerData.UnlockedBuildings.push(building.id);
                this.DataObject.updateData();
            } 
        }
        else
        {
            return;
        }
        this.enableAll();
    
    }

    displayBuildWindow (building,selectedBuilding)
    {
        
        this.disableAll();
        let popup = document.getElementById('construction');
        if (popup && popup.style.display === 'none' ){
            popup.style.display = 'block';
        }
        let buildButton = document.getElementById("build-button");
        buildButton.addEventListener("click", () => {
            this.construire(building,buildButton,selectedBuilding);
            popup.style.display = "none";
        })

        document.getElementById("price").innerHTML = "Price : " + building.price + " Gold";
        document.getElementById("name").innerHTML = building.name;
        document.getElementById("rendings").innerHTML = "Rendings : " + building.rendings + " Gold per second";

        let closeButton = document.getElementById("close");
        closeButton.addEventListener("click", () => {
            popup.style.display = 'none';
            this.enableAll();
        })
        

    }

    displayDetails(building)
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
}