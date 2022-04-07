import { disableAll, PlayerData } from "./building.js";


function displayMaterials(popupImage) {

    let popupMaterials = document.getElementById("materials_popup");

    popupImage[1].forEach(element => (
        element.setVisible(true)
    ))

    popupMaterials.style.display = 'block';

    for (const [key, value] of Object.entries(PlayerData.Materials)) {
        let toChange = document.getElementById(key);
        toChange.innerHTML = key + " " + value;

    }
    let yo = document.getElementById("Gems")
    yo.innerHTML = "Gems : " + PlayerData.Currency["Gems"]
    disableAll()

}


export { displayMaterials };