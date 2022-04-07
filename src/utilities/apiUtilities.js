import * as Global from "../utilities/global.js";

export async function getAttractions(){
    var url = `${Global.LINK}/Projet-Commun-1/src/data/buildings.json`;

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

export async function getMinions(){
    var url = `${Global.LINK}/Projet-Commun-1/src/data/minions.json`;

    const response = await fetch(url, {
        method: 'GET', 
        headers: {
            'Accept': 'application/json', 
            'Content-Type':'application/json'
        }
    }
    )
    const minions = await response.json();
    return minions
}