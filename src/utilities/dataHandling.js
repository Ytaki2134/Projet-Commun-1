const baseData = {
    Currency: {
        Gold: 0,
        Crystals: 0,
    },
}

class Data{
    constructor(){
        let playerData = localStorage.getItem('data');
        if(!playerData || playerData == null){
            localStorage.setItem('data', JSON.stringify(baseData));
            playerData = localStorage.getItem('data');
        }else{
            console.log("?");
            playerData = this.fixData(JSON.parse(playerData), baseData);
            localStorage.setItem('data', JSON.stringify(playerData));
        }
        this.playerData = {...playerData};
        this.savedPlayerData = JSON.parse(JSON.stringify(this.playerData)); // DEEP CLONE
        this.listenValueChanged = {};
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
        return playerData 
    }

    getData(){
        return this.playerData;
    }

    On(key, fct){
        this.listenValueChanged[key] = fct;
    }

    onChangeValue(original, clone){ //clone should be on an hight version than original
        for (const [key, value] of Object.entries(clone)) {
            if(typeof(value)==="object" && value != null){
                this.onChangeValue(original[key], clone[key]);
            }else if(original[key] != undefined && original[key] != value){
                if(this.listenValueChanged[key]){
                    this.listenValueChanged[key](value);
                }
            }
        }
    }

    updateData(){
        this.onChangeValue(this.savedPlayerData, this.playerData);
        this.savedPlayerData = JSON.parse(JSON.stringify(this.playerData));;
        localStorage.setItem('data', JSON.stringify(this.savedPlayerData));
    }
}

export default Data;