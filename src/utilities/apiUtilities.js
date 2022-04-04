import * as Global from "./global.js";

export async function getAttractions(){
    var url = `${Global.LINK}/ProjetCommun-1/Projet-Commun-1//src/data/buildings.json`;

    const response = await fetch(url, {
        method: 'GET', 
        headers: {
            'Accept': 'application/json', 
            'Content-Type':'application/json'
        }
    }
    )
    const attractions = await response.json();
    return attractions
}