class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this.firing = false;
        this.frames = 0;
        this.cooldown = 30;

        this.speed = 500;
        this.maxHP = 5;
        this.hp = this.maxHP;
        this.game = scene;

        this.attackPattern = 0;
        this.powerupFrames = 0;
        this.powerupCooldown = 1800;

        let input = this.game.input;
        this.up = input.keyboard.addKey('W');
        this.left = input.keyboard.addKey('A');
        this.down = input.keyboard.addKey('S');
        this.right = input.keyboard.addKey('D');
        this.shoot = input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.setScale(0.75);
        this.setAngle(90);

        scene.add.existing(this);

        this.game.physics.add.existing(this);
        this.body.setSize(100, 50);

        let my = this.game.my;

        my.sprite.cannonballGroup = this.game.add.group({
            active: true,
            defaultKey: "ships",
            defaultFrame: "cannonBall.png",
            maxSize: 30,
            runChildUpdate: true
        });
        my.sprite.cannonballGroup.createMultiple({
            classType: Cannonball,
            active: false,
            key: my.sprite.cannonballGroup.defaultKey,
            frame: my.sprite.cannonballGroup.defaultFrame,
            repeat: my.sprite.cannonballGroup.maxSize-1,
            setXY: {
                x:-200,
                y:-200
            }
        });
        my.sprite.cannonballGroup.propertyValueSet("scale", 2);

        this.shoot.on('down', (key, event) => {
            if (this.firing) this.frames = 0;
            this.firing = !this.firing;
        });

        return this;
    }

    update() {
        // Moving left
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (this.x > (this.displayWidth/2)) {
                this.body.setVelocityX(-this.speed);
            }
            this.angle = -90;
            this.body.setSize(100, 50);
        }

        // Moving right
        else if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (this.x < (game.config.width - (this.displayWidth/2))) {
                this.body.setVelocityX(this.speed);
            }
            this.angle = 90;
            this.body.setSize(100, 50);
        }
        else {
            this.body.setVelocityX(0);
        }

        // Moving up
        if (this.up.isDown) {
            // Check to make sure the sprite can actually move up
            if (this.y > (this.displayHeight/2)) {
                this.body.setVelocityY(-this.speed);
            }
            this.angle = 0;
            this.body.setSize(50, 100);
        }

        // Moving down
        else if (this.down.isDown) {
            // Check to make sure the sprite can actually move down
            if (this.y < (game.config.height - (this.displayHeight/2))) {
                this.body.setVelocityY(this.speed);
            }
            this.angle = 180;
            this.body.setSize(50, 100);
        }
        else {
            this.body.setVelocityY(0);
        }

        if (this.firing) {
            this.frames -= 1;
            if (this.frames < 0) {
                this.frames = this.cooldown;
                this.game.sound.play("player_fire");
                switch (this.attackPattern) {
                    case 0:
                        this.spawnCannonball("none", "up");
                        break;

                    case 1:
                        this.spawnCannonball("left", "up");
                        this.spawnCannonball("left", "down");
                        this.spawnCannonball("right", "up");
                        this.spawnCannonball("right", "down");
                        break;

                    case 2:
                        this.spawnCannonball("none", "up");
                        this.spawnCannonball("none", "down");
                        this.spawnCannonball("left", "none");
                        this.spawnCannonball("right", "none");
                        break;

                    case 3:
                        this.spawnCannonball("none", "up");
                        this.spawnCannonball("none", "down");
                        this.spawnCannonball("left", "none");
                        this.spawnCannonball("right", "none");
                        this.spawnCannonball("left", "up");
                        this.spawnCannonball("left", "down");
                        this.spawnCannonball("right", "up");
                        this.spawnCannonball("right", "down");
                        break;
                }
            }
        }

        if (this.attackPattern > 0) {
            this.powerupFrames -= 1;
            if (this.powerupFrames <= 0) this.attackPattern = 0;
        }
    }

    spawnCannonball(xDir, yDir) {
        // Get the first inactive cannonball, and make it active
        let cannonball = this.game.my.sprite.cannonballGroup.getFirstDead();
        // cannonball will be null if there are no inactive (available) cannonballs
        if (cannonball != null) {
            cannonball.makeActive();
            cannonball.x = this.game.my.sprite.player.x;
            cannonball.y = this.game.my.sprite.player.y;
            cannonball.xDir = xDir;
            cannonball.yDir = yDir;
        }
    }

    takeDamage() {
        this.hp -= 1;
        if (this.hp > 0) {
            let ratio = this.hp / this.maxHP;
            let frame;
            if (ratio >= 0.66) frame = 2;
            else if (ratio >= 0.33) frame = 1;
            else frame = 0;
            console.log(this.hp, ratio, frame);
            this.setFrame(this.game.playerFrames[frame]);
        }
        else this.game.scene.start("startScene", {highScore: this.game.highScore});
    }
}