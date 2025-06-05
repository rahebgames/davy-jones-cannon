class Player extends Phaser.GameObjects.Sprite {
    // x,y - starting sprite location
    // spriteKey - key for the sprite image asset
    // leftKey - key for moving left
    // rightKey - key for moving right
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this.rx = this.displayWidth/2;
        this.ry = this.displayHeight/2;

        this.firing = false;
        this.frames = 0;
        this.cooldown = 30;

        this.speed = 500;
        this.hp = 3
        this.game = scene;

        let input = this.game.input;
        this.left = input.keyboard.addKey('A');
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
            maxSize: 10,
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
        }

        // Moving right
        else if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (this.x < (game.config.width - (this.displayWidth/2))) {
                this.body.setVelocityX(this.speed);
            }
            this.angle = 90;
        }
        else {
            this.body.setVelocityX(0);
        }

        if (this.firing) {
            this.frames -= 1;
            if (this.frames < 0) {
                // Get the first inactive cannonball, and make it active
                let cannonball = this.game.my.sprite.cannonballGroup.getFirstDead();
                // cannonball will be null if there are no inactive (available) cannonballs
                if (cannonball != null) {
                    this.frames = this.cooldown;
                    cannonball.makeActive();
                    cannonball.x = this.game.my.sprite.player.x;
                    cannonball.y = this.game.my.sprite.player.y - (this.game.my.sprite.player.displayHeight/2);
                    this.game.sound.play("player_fire");
                }
            }
        }
    }

}