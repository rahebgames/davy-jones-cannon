class Cannonball extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {        
        super(scene, x, y, texture, frame);

        this.visible = false;
        this.active = false;
        this.speed = 1000;
        this.game = scene;
        this.game.physics.add.existing(this);
        this.body.setSize(10, 10);

        this.xDir = "none";
        this.yDir = "up";

        return this;
    }

    update() {
        if (this.active) {
            if (this.xDir == "right") this.body.setVelocityX(this.speed);
            else if (this.xDir == "left") this.body.setVelocityX(-this.speed);
            else this.body.setVelocityX(0);
            if (this.yDir == "up") this.body.setVelocityY(-this.speed);
            else if (this.yDir == "down") this.body.setVelocityY(this.speed);
            else this.body.setVelocityY(0);

            let onScreen = this.x > (this.displayWidth/2) && this.x < (game.config.width - (this.displayWidth/2)) && this.y > (this.displayHeight/2) && this.y < (game.config.height - (this.displayHeight/2))
            if (!onScreen) {
                this.makeInactive();
            }
        }
    }

    makeActive() {
        this.visible = true;
        this.active = true;
        this.game.physics.world.enable(this);
    }

    makeInactive() {
        this.visible = false;
        this.active = false;
        this.game.physics.world.disable(this);
    }

}