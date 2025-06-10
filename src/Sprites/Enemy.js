class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {        
        super(scene, x, y, texture, frame);

        this.visible = false;
        this.active = false;

        this.movingDown = true;
        this.finalDepth = this.getRndInteger(50, game.config.height - 200);
        this.dir = 1;
        this.cooldown = 60;
        this.frames = this.cooldown;
        this.hp = 3;

        this.fullHpSprite = ["ship (6).png", "ship (3).png", "ship (2).png", "ship (5).png", "ship (4).png"];
        this.midHpSprite = ["ship (12).png", "ship (9).png", "ship (8).png", "ship (11).png", "ship (10).png"];
        this.lowHpSprite = ["ship (18).png", "ship (15).png", "ship (14).png", "ship (17).png", "ship (16).png"];

        this.speed = 300;
        this.fastSpeed = 600;

        this.typeWeights = [3, 3, 2, 1, 1];
        this.weightSum = 0;
        for (let weight of this.typeWeights) this.weightSum += weight;
        let choice = this.getRndInteger(1, this.weightSum);
        for (let i = 0; i <= 4; i++) {
            if (choice <= this.typeWeights[i]) {
                this.type = i;
                break;
            }
            choice -= this.typeWeights[i];
        }
        this.setFrame(this.fullHpSprite[this.type]);
        if (this.type == 2) this.speed = this.fastSpeed;

        this.startX = this.getRndInteger(20, game.config.width - 20);
        if (this.type != 4) this.startY = 0;
        else this.startY = game.config.height + 40;
        this.x = this.startX;
        this.y = this.startY;
        this.scale = 0.75;
        this.spriteArray = [this.lowHpSprite, this.midHpSprite, this.fullHpSprite];

        this.game = scene;
        this.game.physics.add.existing(this);
        this.body.setSize(50, 100);

        this.group = this.game.my.sprite.enemyGroup;

        this.enemyCannonballConfig = {
            classType: EnemyCannonball,
            key: this.game.my.sprite.enemyCannonballGroup.defaultKey,
            frame: this.game.my.sprite.enemyCannonballGroup.defaultFrame,
        };

        return this;
    }

    update() {
        if (this.active) {
            if (this.type == 3) {
                if (this.movingDown) {
                    let dir = this.getRndInteger(0,1);
                    this.points = [
                        this.startX, this.startY,
                        this.startX + (100 * ((-1) ** dir)), game.config.height/2,
                        this.game.my.sprite.player.x, this.game.my.sprite.player.y,
                        this.startX, game.config.height + 100
                    ]
                    this.curve = new Phaser.Curves.Spline(this.points);
                    this.tween = this.game.tweens.add({
                        targets: { t: 0 },
                        t: 1,
                        duration: 3000,
                        repeat: 0,
                        ease: 'Sine.easeInOut',
                        onUpdate: (tween) => {
                            const t = tween.getValue();
                            const current = this.curve.getPoint(t);
                            const delta = 0.001; // small value ahead on curve
                            const next = this.curve.getPoint(Math.min(t + delta, 1)); // clamp to 1
                            this.x = current.x;
                            this.y = current.y;
                            this.setRotation(Phaser.Math.Angle.Between(current.x, current.y, next.x, next.y) + Phaser.Math.DegToRad(-90));
                        },
                        onComplete: () => {
                            this.group.remove(this, true);
                            this.game.enemyCount -= 1;
                            this.game.score += 50;
                            this.game.scoreText.setText("Score: " + this.game.score);
                            if (this.game.score > this.game.highScore) this.game.highScore = this.game.score;
                        }
                    });
                    this.movingDown = false;
                }
            } else if (this.type == 4) {
                if (this.movingDown) {
                    let dir = this.getRndInteger(0,1);
                    let player = this.game.my.sprite.player;
                    this.points = [
                        this.startX, this.startY,
                        this.startX + (100 * ((-1) ** dir)), Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y),
                        player.x, player.y,
                        this.startX, -100
                    ]
                    this.curve = new Phaser.Curves.Spline(this.points);
                    this.tween = this.game.tweens.add({
                        targets: { t: 0 },
                        t: 1,
                        duration: 3000,
                        repeat: 0,
                        ease: 'Sine.easeInOut',
                        onUpdate: (tween) => {
                            const t = tween.getValue();
                            const current = this.curve.getPoint(t);
                            const delta = 0.001; // small value ahead on curve
                            const next = this.curve.getPoint(Math.min(t + delta, 1)); // clamp to 1
                            this.x = current.x;
                            this.y = current.y;
                            this.setRotation(Phaser.Math.Angle.Between(current.x, current.y, next.x, next.y) + Phaser.Math.DegToRad(-90));
                        },
                        onComplete: () => {
                            this.group.remove(this, true);
                            this.game.enemyCount -= 1;
                            this.game.score += 50;
                            this.game.scoreText.setText("Score: " + this.game.score);
                            if (this.game.score > this.game.highScore) this.game.highScore = this.game.score;
                        }
                    });
                    this.movingDown = false;
                }
            } else {
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
                            let xDirs = ["right", "left", "left", "right"];
                            let yDirs = ["up", "up", "down", "down"]
                            for (let i = 0; i < 4; i++) {
                                cannonball = this.game.my.sprite.enemyCannonballGroup.createFromConfig(this.enemyCannonballConfig)[0];
                                cannonball.xDir = xDirs[i];
                                cannonball.yDir = yDirs[i];
                                cannonball.x = this.x;
                                cannonball.y = this.y;
                            }
                            this.game.sound.play("enemy_fire");
                            break;

                        case 1:
                            let dirs = ["right", "left", "up", "down"];
                            for (let i = 0; i < 4; i++) {
                                cannonball = this.game.my.sprite.enemyCannonballGroup.createFromConfig(this.enemyCannonballConfig)[0];
                                if (i < 2) cannonball.xDir = dirs[i];
                                else cannonball.yDir = dirs[i];
                                cannonball.x = this.x;
                                cannonball.y = this.y;
                            }
                            this.game.sound.play("enemy_fire");
                            break;
                    }
                    this.frames = this.cooldown;
                }
            }
        }
    }

    setSprite() {
        this.setFrame(this.spriteArray[this.hp-1][this.type]);
    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
}