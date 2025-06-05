class EnemyCannonball extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {        
        super(scene, x, y, texture, frame);

        this.rx = this.displayWidth/2;
        this.ry = this.displayHeight/2;
        this.visible = false;
        this.active = false;
        this.xDir = "null";
        this.yDir = "null";
        this.speed = 500;
        this.cooldown = 10;
        this.frames = this.cooldown;

        this.game = scene;
        this.game.physics.add.existing(this);
        this.body.setSize(10, 10);
        this.group = this.game.my.sprite.enemyCannonballGroup;

        return this;
    }

    update() {
        if (this.active) {
            if (this.xDir == "right") this.body.setVelocityX(this.speed);
            if (this.xDir == "left") this.body.setVelocityX(-this.speed);
            if (this.yDir == "up") this.body.setVelocityY(-this.speed);
            if (this.yDir == "down") this.body.setVelocityY(this.speed);

            if (this.xDir == "right" && this.yDir == "up") this.angle = 225;
            else if (this.xDir == "right" && this.yDir == "down") this.angle = -45;
            else if (this.xDir == "left" && this.yDir == "down") this.angle = 45;
            else if (this.xDir == "left" && this.yDir == "up") this.angle = 135;

            else if (this.xDir == "right") this.angle = -90;
            else if (this.xDir == "left") this.angle = 90;
            else if (this.yDir == "up") this.angle = 180;

            this.frames -= 1;
            if (this.frames < 0) {
                this.flipX = !this.flipX;
                this.frames = this.cooldown;
            }

            let onScreen = this.x > (this.displayWidth/2) && this.x < (game.config.width - (this.displayWidth/2)) && this.y > (this.displayHeight/2) && this.y < (game.config.height - (this.displayHeight/2))
            if (!onScreen) {
                this.game.physics.world.disable(this);
                this.group.remove(this, true);
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