const baseData = {
    Currency: {
        Gold: 0,
        Crystals: 0,
    }
}

class Data{
    constructor(){
        let playerData = localStorage.getItem('data');
        if(!playerData){
            localStorage.setItem('data', JSON.stringify(baseData));
            playerData = localStorage.getItem('data');
        }else{
            playerData = this.fixData(JSON.parse(playerData), baseData);
        }
        this.playerData = playerData;
    }

    fixData(playerData, base){
        for (const [key, value] of Object.entries(base)) {
            if(playerData[key] === undefined){
                playerData[key] = value
                console.log(key);
            } else if(typeof(value)=="object" && value != null){
                console.log(key);
                playerData[key] = this.fixData(playerData[key], value);
            }
        }
        console.log(playerData);
        return playerData 
    }

    getData(){
        return this.playerData;
    }
}

export default Data;