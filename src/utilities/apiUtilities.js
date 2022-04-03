import * as Global from "../utilities/global.js";

export async function getAttractions(){
    var url = `${Global.LINK}ProjetCommun-1/Projet-Commun-1/src/data/main.json`;

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