class EnemyCannonball extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {        
        super(scene, x, y, texture, frame);

        this.rx = this.displayWidth/2;
        this.ry = this.displayHeight/2;
        this.visible = false;
        this.active = false;
        this.xDir = "null";
        this.yDir = "null";

        this.cooldown = 10;
        this.frames = this.cooldown;
        return this;
    }

    update() {
        if (this.active) {
            if (this.xDir == "right") this.x += this.speed;
            if (this.xDir == "left") this.x -= this.speed;
            if (this.yDir == "up") this.y -= this.speed;
            if (this.yDir == "down") this.y += this.speed;

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
                this.group.remove(this, true);
            }
        }
    }

    makeActive() {
        this.visible = true;
        this.active = true;
    }

    makeInactive() {
        this.visible = false;
        this.active = false;
    }

}