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
        this.x = this.getRndInteger(20, game.config.width - 20);
        this.y = 0;
        this.scale = 0.75;
        this.speed = 300;
        this.fastSpeed = 600;

        this.type = this.getRndInteger(0, 2);
        switch(this.type) {
            case 0:
                this.setFrame("ship (6).png"); // 6, 12, 18
                break;
            case 1:
                this.setFrame("ship (3).png"); // 3, 9, 15
                break;
            case 2:
                this.setFrame("ship (2).png"); //2, 8, 14
                this.speed = this.fastSpeed;
                break;
        }

        this.game = scene;
        this.game.physics.add.existing(this);
        this.body.setSize(50, 100);

        this.group = this.game.my.sprite.enemyGroup;

        return this;
    }

    update() {
        if (this.active) {
            if (this.movingDown) {
                this.body.setVelocityY(this.speed);
                if (this.y >= this.finalDepth && this.type != 2) this.movingDown = false;
            
            } else {
                this.body.setVelocityY(0);
                this.body.setSize(100, 50);
                if (this.dir == 1) this.angle = 90;
                else this.angle = -90;
                this.body.setVelocityX(this.speed * this.dir);
                if (this.x < (this.displayWidth/2) || this.x > (game.config.width - (this.displayWidth/2))) {
                    this.dir *= -1;
                    this.x += 15 * this.dir;
                }
            }

            if (this.y > (game.config.height - (this.displayHeight/2) + 100)) {
                this.group.remove(this, true);
                this.game.enemyCount -= 1;
                this.game.score += 50;
                this.game.scoreText.setText("Score: " + this.game.score);
                if (this.game.score > this.game.highScore) this.game.highScore = this.game.score;
            }

            this.frames -= 1;
            if (this.frames < 0) {
                let cannonball;
                switch(this.type) {
                    case 0:
                        cannonball = this.game.my.sprite.enemyCannonballGroup.createFromConfig(this.game.enemyCannonballConfig)[0];
                        cannonball.xDir = "right";
                        cannonball.yDir = "up";
                        cannonball.x = this.x;
                        cannonball.y = this.y;

                        cannonball = this.game.my.sprite.enemyCannonballGroup.createFromConfig(this.game.enemyCannonballConfig)[0];
                        cannonball.xDir = "left";
                        cannonball.yDir = "up";
                        cannonball.x = this.x;
                        cannonball.y = this.y;

                        cannonball = this.game.my.sprite.enemyCannonballGroup.createFromConfig(this.game.enemyCannonballConfig)[0];
                        cannonball.xDir = "left";
                        cannonball.yDir = "down";
                        cannonball.x = this.x;
                        cannonball.y = this.y;

                        cannonball = this.game.my.sprite.enemyCannonballGroup.createFromConfig(this.game.enemyCannonballConfig)[0];
                        cannonball.xDir = "right";
                        cannonball.yDir = "down";
                        cannonball.x = this.x;
                        cannonball.y = this.y;

                        this.game.sound.play("enemy_fire");
                        break;

                    case 1:
                        cannonball = this.game.my.sprite.enemyCannonballGroup.createFromConfig(this.game.enemyCannonballConfig)[0];
                        cannonball.xDir = "right";
                        cannonball.x = this.x;
                        cannonball.y = this.y;

                        cannonball = this.game.my.sprite.enemyCannonballGroup.createFromConfig(this.game.enemyCannonballConfig)[0];
                        cannonball.xDir = "left";
                        cannonball.x = this.x;
                        cannonball.y = this.y;

                        cannonball = this.game.my.sprite.enemyCannonballGroup.createFromConfig(this.game.enemyCannonballConfig)[0];
                        cannonball.yDir = "up";
                        cannonball.x = this.x;
                        cannonball.y = this.y;

                        cannonball = this.game.my.sprite.enemyCannonballGroup.createFromConfig(this.game.enemyCannonballConfig)[0];
                        cannonball.yDir = "down";
                        cannonball.x = this.x;
                        cannonball.y = this.y;

                        this.game.sound.play("enemy_fire");
                        break;
                }
                this.frames = this.cooldown;
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

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
}