class Cannonball extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {        
        super(scene, x, y, texture, frame);

        this.rx = this.displayWidth/2;
        this.ry = this.displayHeight/2;
        this.visible = false;
        this.active = false;
        this.speed = 1000;
        this.game = scene;
        this.game.physics.add.existing(this);
        this.body.setSize(10, 10);

        return this;
    }

    update() {
        if (this.active) {
            this.body.setVelocityY(-this.speed);
            if (this.y < -(this.displayHeight/2)) {
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