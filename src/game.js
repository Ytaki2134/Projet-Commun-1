import Data from "./utilities/dataHandling.js";
import { MAX_ZOOM, MIN_ZOOM, LAYERS } from "./utilities/global.js";
import Buildings from "./module/building.js";
import Units from "./module/Units.js";

export default class Game {
    constructor() {
        var config = {
            type: Phaser.WEBGL,
            width: 1200,
            height: 800,
            backgroundColor: '#6BBFF6',
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
            UnitsObject: new Units(),
            Frames: {},
        }
    }

    preload() {
        this.load.image('field', 'image/field.png');
        this.load.image('background', 'image/background.png');
        this.load.image('built', 'image/built.png');
        this.load.image('popup', 'image/minion-parchemin.png');
        this.load.image('stable', 'image/construction.png');
        this.load.image('materialButton', 'image/parchemin1.png');
        this.load.image('kamos', 'image/parchemin2.png');
        this.load.image('pop', 'image/parchemin3.png');
        this.load.image('switchMenu', 'image/button.png');
        this.load.image('close', 'image/close_button.png');
        this.load.image('popup2', 'image/donjon-parchemin.png');
        this.load.image('popupTrigger2', 'image/parchemin_menu.png');
        this.load.spritesheet('building', 'image/building.01.png', { frameWidth: 791, frameHeight: 676 });

        this.load.image('base_tiles', 'public/assets/tiles.png')

        // load the JSON file
        this.load.tilemapTiledJSON('map', 'public/assets/map.json')

        window.Game.PlayerData = window.Game.DataObject.getData();
        for (const [key, value] of Object.entries(this)) {
            window.Game[key] = value
        }
    }

    create() {
        //camera
        var cam = this.cameras.main;
        cam.setZoom(0.3);

        //generating map
        var map = this.add.tilemap('map');
        var tileset1 = map.addTilesetImage('tiles', 'base_tiles');
        for (let i = 1; i < LAYERS; i++) {
            map.createLayer('Tile Layer ' + i, [tileset1]);
        }

        //Popup handler
        let popupWindow = this.add.image(600, 400, 'popup');
        popupWindow.setScale(0.40)
        popupWindow.setDepth(5)
        popupWindow.setVisible(false)

        let popupStable = this.add.image(600, 700, 'stable')
        popupStable.setScale(0.40)
        popupStable.setDepth(5)
        popupStable.setVisible(false)

        let popupMaterials = this.add.image(600, 400, 'popup2')
        popupMaterials.setScale(1.125)
        popupMaterials.setDepth(5)
        popupMaterials.setVisible(false)

        let closeButton = this.add.image(950, 200, 'close')
        closeButton.setScale(.40)
        closeButton.setDepth(6)
        closeButton.setVisible(false)

        let popup = [[popupWindow, popupStable, closeButton], [popupMaterials, closeButton]]

        //resources handler
        let materialButton = this.add.image(125, 50, 'materialButton');
        let kamos = this.add.image(325, 50, 'kamos');
        let population = this.add.image(525, 50, 'pop');

        window.Game.Frames.MenuTrigger = this.add.image(160, 730, 'popupTrigger2').setInteractive();
        window.Game.Frames.MenuTrigger.setScale(0.35);
        window.Game.Frames.Menu2 = this.add.image(600, 400, 'popup2');
        window.Game.Frames.Menu2.setVisible(false);

        let ressources = [materialButton, kamos, population]

        ressources.forEach(element => {
            element.setScale(.45).setDepth(2).setInteractive().on('pointerdown', () => (displayMaterials(popup)))
        })

        //currency handler
        let pos = 0;
        let goldCurrencyHtml = document.getElementById("Currency-Counter");
        let goldCurrencyHtml2 = document.getElementById("Exp-Currency-Counter");
        console.log(goldCurrencyHtml);

        goldCurrencyHtml.addEventListener('DOMSubtreeModified', function () {
            var MutationObserver = window.MutationObserver
                || window.WebKitMutationObserver
                || window.MozMutationObserver;
            var observer = new MutationObserver(function () {
                CardRefresh();
            });
            observer.observe(goldCurrencyHtml, { childList: true });
        });
    
        goldCurrencyHtml2.addEventListener('DOMSubtreeModified', function () {
            var MutationObserver = window.MutationObserver
                || window.WebKitMutationObserver
                || window.MozMutationObserver;
            var observer = new MutationObserver(function () {
                CardRefresh();
            });
            observer.observe(goldCurrencyHtml2, { childList: true });
        });

        //Classes
        window.Game.BuildingsObject.main(popup);
        window.Game.UnitsObject.main();

        //event listener
        closeButton.setInteractive().on('pointerdown', () => {
            popup.forEach(element => (
                element.forEach(child => {
                    child.setVisible(false);
                })
            ))
        })

        this.input.on("pointermove", function (p) {
            if (!p.isDown) return;
            cam.scrollX -= (p.x - p.prevPosition.x) / cam.zoom;
            cam.scrollY -= (p.y - p.prevPosition.y) / cam.zoom;
        });

        this.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ) {
            let newZoom = cam._zoomY;
            if (deltaY > 0 && cam._zoomY < MAX_ZOOM) {
                newZoom += 0.05;
            } else if (deltaY < 0 && cam._zoomY > MIN_ZOOM) {
                newZoom -= 0.05;
            }
            cam.setZoom(newZoom);
        });
    }

    update() {
        let gold = 0;

        window.Game.PlayerData.Currency.Gold += gold

        var CurrentGold = window.Game.PlayerData.Currency.Gold;
        if (window.Game.PlayerData.Currency.Gold > 1000000) {
            CurrentGold = (window.Game.PlayerData.Currency.Gold / 1000000).toFixed(2) + " M"
        } else if (window.Game.PlayerData.Currency.Gold > 1000) {
            CurrentGold = (window.Game.PlayerData.Currency.Gold / 1000).toFixed(2) + " K"
        }

        document.getElementById("money").innerHTML = CurrentGold;
        document.getElementById("rendings-amount").innerHTML = gold + "/sec"
        window.Game.DataObject.getData()
    }
}
