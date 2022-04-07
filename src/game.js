import Data from "./utilities/dataHandling.js";
import { MAX_ZOOM, MIN_ZOOM, LAYERS } from "./utilities/global.js";
import Buildings from "./module/building.js";


export default class Game{
    constructor(){
        var config = {
            type: Phaser.WEBGL,
            width: 1200,
            height: 800,
            backgroundColor: '#2d2d2d',
            parent: 'phaser-example',
            scene: {
                preload: this.preload,
                create: this.create,
                update: this.update
            },
        };
        
        window.Game = {
            game: new Phaser.Game(config),
            DataObject: new Data(),
            BuildingsObject: new Buildings(),
        }
    }

    preload(){
        this.load.image('field', 'image/field.png');
        this.load.image('built', 'image/built.png');
    
        this.load.image('base_tiles', 'public/assets/tiles.png')
    
        // load the JSON file
        this.load.tilemapTiledJSON('map', 'public/assets/map.json')
    
        window.Game.PlayerData = window.Game.DataObject.getData();
        for (const [key, value] of Object.entries(this)) {
            window.Game[key] = value
        }
    }

    create(){
        //camera
        var cam = this.cameras.main;
        cam.setZoom(0.3);

        //generating mapmap
        var map = this.add.tilemap('map');
        var tileset1 = map.addTilesetImage('tiles', 'base_tiles');
        for (let i=1; i<LAYERS; i++) {
            map.createLayer('Tile Layer ' + i, [tileset1]);
        }

        //objects layers
        console.log(map.getObjectLayer('Object Layer 1'));
        this.objectLayer = map.getObjectLayer('Object Layer 1')['objects'];
        this.objectLayer.forEach(object => {
            console.log(object);
        })

        //Classes
        window.Game.BuildingsObject.main();

        //event listener
        this.input.on("pointermove", function (p) {            
            if (!p.isDown) return;
            cam.scrollX -= (p.x - p.prevPosition.x) / cam.zoom;
            cam.scrollY -= (p.y - p.prevPosition.y) / cam.zoom;
        });

        this.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ) {
            let newZoom = cam._zoomY;
            console.log(cam._zoomY, deltaY);
            if(deltaY>0 && cam._zoomY < MAX_ZOOM){
                newZoom += 0.05;
            }else if(deltaY<0 && cam._zoomY > MIN_ZOOM){
                newZoom -= 0.05;
            }
            cam.setZoom(newZoom);
        });

        this.input.on('pointerup', function (pointer) {
            var tile = map.getTilesWithinWorldXY(pointer.worldX, pointer.worldY, 256, 256);
            if(tile && tile[0]){
                console.log(tile[0]);
                tile[0].layer.visible = false
            }
          }, this);
    }

    update(){
        
    }
}