class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {        
        super(scene, x, y, texture, frame);

        this.rx = this.displayWidth/2;
        this.ry = this.displayHeight/2;
        this.visible = false;
        this.active = false;

        this.movingDown = true;
        this.finalDepth = this.getRndInteger(50, game.config.height - 300);
        this.dir = 1;
        this.cooldown = 60;
        this.frames = this.cooldown;
        this.hp = 3;

        return this;
    }

    update() {
        if (this.active) {
            if (this.movingDown) {
                this.y += this.speed;
                if (this.y >= this.finalDepth && this.type != 2) this.movingDown = false;
            
            } else {
                if (this.dir == 1) this.angle = 90;
                else this.angle = -90;
                this.x += this.speed * this.dir;
                if (this.x < (this.displayWidth/2) || this.x > (game.config.width - (this.displayWidth/2))) {
                    this.dir *= -1;
                    this.x += this.speed * this.dir;
                }
            }

            if (this.y > (game.config.height - (this.displayHeight/2) + 100)) {
                this.group.remove(this, true);
                this.parent.enemyCount -= 1;
                this.parent.score += 50;
                this.parent.scoreText.setText("Score: " + this.parent.score);
                if (this.parent.score > this.parent.highScore) this.parent.highScore = this.parent.score;
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

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
}