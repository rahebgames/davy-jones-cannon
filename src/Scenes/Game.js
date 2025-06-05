class Game extends Phaser.Scene {
    constructor() {
        super("gameScene");

        this.playerX = game.config.width / 2;
        this.playerY = game.config.height - 50;

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

        this.load.audio("enemy_fire", "enemy_fire.ogg");
        this.load.audio("player_fire", "player_fire.ogg");
        this.load.audio("enemy_impact", "enemy_impact.ogg");
        this.load.audio("player_impact", "player_impact.ogg");
    }

    create() {
        document.getElementById('description').innerHTML = '<h2>Game.js</h2>';

        this.init_game();

        let my = this.my;   // create an alias to this.my for readability

        this.map = this.add.tilemap("map", 64, 64, 13, 10);
        this.tileset = this.map.addTilesetImage("pirate_background", "background_tiles");

        this.waterLayer = this.map.createLayer("Water", this.tileset, 0, 0);
        this.shadingLayer = this.map.createLayer("Shading", this.tileset, 0, 0);
        this.decorLayer = this.map.createLayer("Decor", this.tileset, 0, 0);

        my.sprite.player = new Player(this, this.playerX, this.playerY, "ships", "ship (1).png");

        this.scoreText = this.add.text(20, 20, "Score: " + this.score, {
            fontSize: '24px',
            color: "#000000"
        })

        my.sprite.enemyCannonballGroup = this.add.group({
            active: true,
            defaultKey: "ships",
            defaultFrame: "fire1.png",
            maxSize: -1,
            runChildUpdate: true
        }); 
        this.enemyCannonballConfig = {
            classType: EnemyCannonball,
            key: my.sprite.enemyCannonballGroup.defaultKey,
            frame: my.sprite.enemyCannonballGroup.defaultFrame,
        };

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
            this.waveInProgress = true;
            my.sprite.player.hp = 3;
            my.sprite.player.setFrame("ship (1).png");
            console.log("New Wave: " + this.maxEnemyCount + " enemies");

        } else {
            if (this.spawnedEnemyCount < this.maxEnemyCount) {
                this.waveFrames -= 1;
                if (this.waveFrames < 0) {
                    let enemy = my.sprite.enemyGroup.createFromConfig(this.enemyConfig)[0];
                    this.waveFrames = this.enemyCooldown;
                    this.enemyCount += 1;
                    this.spawnedEnemyCount += 1;
                }
            } else if (this.enemyCount == 0) {
                this.waveInProgress = false;
            }
        }

        for (let cannonball of my.sprite.cannonballGroup.children.entries) {
            for (let enemy of my.sprite.enemyGroup.children.entries) {
                if (this.collides(cannonball, enemy) && cannonball.active) {
                    this.sound.play("enemy_impact");
                    enemy.hp -= 1;
                    switch (enemy.type) {
                        case 0:
                            switch (enemy.hp) {
                                case 2:
                                    enemy.setFrame("ship (12).png");
                                    break;
                                case 1:
                                    enemy.setFrame("ship (18).png");
                                    break;
                                case 0:
                                    this.physics.world.disable(enemy);
                                    my.sprite.enemyGroup.remove(enemy, true);
                                    this.enemyCount -= 1;
                                    this.score += 100;
                                    this.scoreText.setText("Score: " + this.score);
                                    if (this.score > this.highScore) this.highScore = this.score;
                                    break;
                            }
                            break;

                            case 1:
                                switch (enemy.hp) {
                                    case 2:
                                        enemy.setFrame("ship (9).png");
                                        break;
                                    case 1:
                                        enemy.setFrame("ship (15).png");
                                        break;
                                    case 0:
                                        this.physics.world.disable(enemy);
                                        my.sprite.enemyGroup.remove(enemy, true);
                                        this.enemyCount -= 1;
                                        this.score += 100;
                                        this.scoreText.setText("Score: " + this.score);
                                        if (this.score > this.highScore) this.highScore = this.score;
                                        break;
                                }
                                break;

                                case 2:
                                    switch (enemy.hp) {
                                        case 2:
                                            enemy.setFrame("ship (8).png");
                                            break;
                                        case 1:
                                            enemy.setFrame("ship (14).png");
                                            break;
                                        case 0:
                                            this.physics.world.disable(enemy);
                                            my.sprite.enemyGroup.remove(enemy, true);
                                            this.enemyCount -= 1;
                                            this.score += 50;
                                            this.scoreText.setText("Score: " + this.score);
                                        if (this.score > this.highScore) this.highScore = this.score;
                                            break;
                                    }
                                    break;
                    }
                    cannonball.makeInactive();
                }
            }
        }

        for (let cannonball of my.sprite.enemyCannonballGroup.children.entries) {
            if (this.collides(cannonball, my.sprite.player)) {
                this.sound.play("player_impact");
                my.sprite.player.hp -= 1;
                switch (my.sprite.player.hp) {
                    case 2:
                        my.sprite.player.setFrame("ship (7).png");
                        break;
                    case 1:
                        my.sprite.player.setFrame("ship (13).png");
                        break;
                    case 0:
                        this.scene.start("startScene", {highScore: this.highScore});
                        break;
                }
                this.physics.world.disable(cannonball);
                my.sprite.enemyCannonballGroup.remove(cannonball, true);
            }
        }

        for (let enemy of my.sprite.enemyGroup.children.entries) {
            if (enemy.type == 2) {
                if (this.collides(enemy, my.sprite.player)) {
                    my.sprite.enemyGroup.remove(enemy, true);
                    this.sound.play("enemy_impact");
                    this.enemyCount -= 1;
                    this.score += 50;
                    this.scoreText.setText("Score: " + this.score);
                    if (this.score > this.highScore) this.highScore = this.score;
                    my.sprite.player.hp -= 1;
                    switch (my.sprite.player.hp) {
                        case 2:
                            my.sprite.player.setFrame("ship (7).png");
                            break;
                        case 1:
                            my.sprite.player.setFrame("ship (13).png");
                            break;
                        case 0:
                            this.scene.start("startScene", {highScore: this.highScore});
                            break;
                    }
                }
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