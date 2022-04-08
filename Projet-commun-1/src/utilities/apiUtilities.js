import * as Global from "../utilities/global.js";

export async function getAttractions(){
    var url = `${Global.LINK}/Projet-commun-1/src/data/buildings.json`;

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