import Buildings from "./building.js";


function displayMaterials(popupImage) {
    window.Game.BuildingsObject.disableAll();
    let popupMaterials = document.getElementById("materials_popup");
    console.log(popupImage[1]);
    popupImage[1].forEach(element => (
        element.setVisible(true)
    ))

    popupMaterials.style.display = 'block';

    for (const [key, value] of Object.entries(window.Game.BuildingsObject.PlayerData.Materials)) {
        let toChange = document.getElementById(key);
        toChange.innerHTML = key + " " + value;

    }


}


export { displayMaterials };