class Game extends Phaser.Scene {
    constructor() {
        super("gameScene");

        this.playerX = game.config.width / 2;
        this.playerY = game.config.height - 50;
        this.playerFrames = ["ship (13).png", "ship (7).png", "ship (1).png"];

        this.cannonballSpeed = 10;

        this.startEnemyCount = 1;
        this.enemyCountMod = 1.2;
        this.enemyCooldown = 120;
        this.enemyCannonballSpeed = 5;
        this.highScore = 0;

        this.maxEnemyCount;
        console.log(this);
    }

    init_game() {
        this.my = {sprite: {}};
        
        this.frames = 0;
        this.score = 0;

        this.wave = 0;
        this.waveInProgress = false;
        this.waveFrames = 0;
        this.enemyCount = 0;
        this.spawnedEnemyCount = 0;
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        this.load.setPath("./assets/");
        this.load.image("background_tiles", "tiles_sheet.png");
        this.load.tilemapTiledJSON("map", "background.json");
        this.load.atlasXML("ships", "shipsMiscellaneous_sheet.png", "shipsMiscellaneous_sheet.xml");

        this.load.image("bronze", "bronze.png");
        this.load.image("silver", "silver.png");
        this.load.image("black", "black.png");
        this.load.image("gold", "gold.png");

        this.load.audio("enemy_fire", "enemy_fire.ogg");
        this.load.audio("player_fire", "player_fire.ogg");
        this.load.audio("enemy_impact", "enemy_impact.ogg");
        this.load.audio("player_impact", "player_impact.ogg");
    }

    create() {
        document.getElementById('description').innerHTML = '<h2>Game.js</h2>';

        this.init_game();

        this.physics.world.drawDebug = false;
        this.physics.world.debugGraphic.clear();

        let my = this.my;   // create an alias to this.my for readability

        this.map = this.add.tilemap("map", 64, 64, 13, 10);
        this.tileset = this.map.addTilesetImage("pirate_background", "background_tiles");

        this.waterLayer = this.map.createLayer("Water", this.tileset, 0, 0);
        this.shadingLayer = this.map.createLayer("Shading", this.tileset, 0, 0);
        this.decorLayer = this.map.createLayer("Decor", this.tileset, 0, 0);

        my.sprite.player = new Player(this, this.playerX, this.playerY, "ships", this.playerFrames[2]);

        this.scoreText = this.add.text(20, 20, "Score: " + this.score, {
            fontSize: '24px',
            color: "#000000"
        })

        my.sprite.powerupGroup = this.add.group({
            active: true,
            maxSize: -1,
            runChildUpdate: true
        });
        this.powerupConfig = {
            key: "bronze",
            classType: Powerup
        };

        my.sprite.enemyCannonballGroup = this.add.group({
            active: true,
            defaultKey: "ships",
            defaultFrame: "fire1.png",
            maxSize: -1,
            runChildUpdate: true
        }); 

        my.sprite.enemyGroup = this.add.group({
            active: true,
            defaultKey: "ships",
            defaultFrame: "ship (2).png",
            maxSize: -1,
            runChildUpdate: true
        });
        this.enemyConfig = {
            classType: Enemy,
            key: my.sprite.enemyGroup.defaultKey,
            frame: my.sprite.enemyGroup.defaultFrame,
        };

        this.physics.add.overlap(my.sprite.enemyGroup, my.sprite.cannonballGroup, (obj1, obj2) => {
            if (obj2.active) {
                this.sound.play("enemy_impact");
                obj1.hp -= 1;
                if (obj1.hp > 0) {
                    obj1.setSprite();
                }
                else {
                    this.physics.world.disable(obj1);
                    my.sprite.enemyGroup.remove(obj1, true);
                    this.enemyCount -= 1;
                    this.score += 100;
                    this.scoreText.setText("Score: " + this.score);
                    if (this.score > this.highScore) this.highScore = this.score;
                }
                obj2.makeInactive();
            }
        });

        this.physics.add.overlap(my.sprite.player, my.sprite.enemyCannonballGroup, (obj1, obj2) => {
            this.sound.play("player_impact");
                obj1.takeDamage();
                this.physics.world.disable(obj2);
                my.sprite.enemyCannonballGroup.remove(obj2, true);
        });

        this.physics.add.overlap(my.sprite.player, my.sprite.enemyGroup, (obj1, obj2) => {
            if (obj2.type >= 2) {
                this.physics.world.disable(obj2);
                my.sprite.enemyGroup.remove(obj2, true);
                this.sound.play("enemy_impact");
                this.enemyCount -= 1;
                this.score += 50;
                this.scoreText.setText("Score: " + this.score);
                if (this.score > this.highScore) this.highScore = this.score;
                obj1.takeDamage();
            }
        });

        this.physics.add.overlap(my.sprite.player, my.sprite.powerupGroup, (obj1, obj2) => {
            obj1.powerupFrames = obj1.powerupCooldown;
            obj1.attackPattern = obj2.rank + 1;
            this.physics.world.disable(obj2);
            my.sprite.powerupGroup.remove(obj2, true);
        });

        this.input.keyboard.on('keydown-P', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);
    }

    update() {
        let my = this.my;    // create an alias to this.my for readability

        if (!this.waveInProgress) {
            this.wave += 1;
            if (this.score > 0) {
                this.score += 500;
                this.scoreText.setText("Score: " + this.score);
                if (this.score > this.highScore) this.highScore = this.score;
            }
            this.spawnedEnemyCount = 0;
            this.maxEnemyCount = this.startEnemyCount * (this.enemyCountMod ** (this.wave - 1));
            this.waveFrames = this.enemyCooldown;
            if (this.wave % 3 == 0) {
                my.sprite.powerupGroup.createFromConfig(this.powerupConfig);
                console.log("Powerup spawned");
            }
            this.waveInProgress = true;
            my.sprite.player.hp = my.sprite.player.maxHP;
            my.sprite.player.setFrame(this.playerFrames[2]);
            console.log("New Wave: " + this.maxEnemyCount + " enemies");

        } else {
            if (this.spawnedEnemyCount < this.maxEnemyCount) {
                this.waveFrames -= 1;
                if (this.waveFrames < 0) {
                    my.sprite.enemyGroup.createFromConfig(this.enemyConfig)[0];
                    this.waveFrames = this.enemyCooldown;
                    this.enemyCount += 1;
                    this.spawnedEnemyCount += 1;
                }
            } else if (this.enemyCount <= 0) {
                this.waveInProgress = false;
            }
        }

        my.sprite.player.update();
    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.rx + b.rx)) return false;

        if (Math.abs(a.y - b.y) > (a.ry + b.ry)) return false;

        return true;
    }

}