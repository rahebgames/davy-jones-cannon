class Start extends Phaser.Scene {
    constructor() {
        super("startScene");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings

        
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        this.load.setPath("./assets/");
        this.load.image("background_tiles", "tiles_sheet.png");
        this.load.tilemapTiledJSON("map", "background.json");
    }

    init(data) {
        this.finalScore = data.highScore;
    }

    create() {
        document.getElementById('description').innerHTML = '<h2>Start.js</h2>';

        this.map = this.add.tilemap("map", 64, 64, 13, 10);
        this.tileset = this.map.addTilesetImage("pirate_background", "background_tiles");

        this.waterLayer = this.map.createLayer("Water", this.tileset, 0, 0);
        this.shadingLayer = this.map.createLayer("Shading", this.tileset, 0, 0);
        this.decorLayer = this.map.createLayer("Decor", this.tileset, 0, 0);

        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        if(this.finalScore) {
            this.add.text(400, 300, "Guns Blazing\nHigh Score: " + this.finalScore + "\nPress Space to Start", {
                fontSize: '48px',
                color: "#000000"
            }).setOrigin(0.5);
        } else {
            this.add.text(400, 300, "Yaaarrrgggghhhh!!!!!\nPress Space to Start", {
                fontSize: '48px',
                color: "#000000"
            }).setOrigin(0.5);
        }

        this.keySpace.on('down', (key, event) => {
            this.scene.start("gameScene");
        });
    }

    update() {

    }
}