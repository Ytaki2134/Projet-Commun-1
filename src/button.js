var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#010101',
    parent: 'Game',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('buttonSprite', 'pictures/Vector-Button-Transparent-PNG.png');
    this.load.image('buttonSpriteReverse', 'pictures/Vector-Button-Reversed-Transparent-PNG.png')
}

function create ()
{
    var recruitButton = this.add.image(400, 300, 'buttonSprite', 0).setInteractive();
    var recruitButtonReverse = this.add.image(400, 300, 'buttonSpriteReverse', 0).setInteractive();

    recruitButtonReverse.visible= false;

    recruitButton.setScale(0.1);
    recruitButtonReverse.setScale(0.1);


    recruitButton.on('pointerover', function () {

        recruitButton.visible= false;
        recruitButtonReverse.visible= true;

    });

    recruitButtonReverse.on('pointerout', function () {

        recruitButtonReverse.visible= false;
        recruitButton.visible= true;

    });

    recruitButtonReverse.on('pointerup', () => {

        let element = document.getElementById('Recruit-Menu')
        if (element && element.style.display === 'none') {

            element.style.display = 'block';

        }
    });
}