class Powerup extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y);

        this.game = scene;
        this.sprites = ["bronze", "black", "gold"];
        this.rank = this.game.my.sprite.player.attackPattern;
        if (this.rank > 2) this.rank = 2;
        this.setTexture(this.sprites[this.rank]);

        this.x = this.getRndInteger(20, game.config.width - 20);
        this.y = -20;

        scene.add.existing(this);

        this.game.physics.add.existing(this);
        this.body.setSize(65, 30);
        this.body.setOffset(0, 30);

        this.speed = 150;

        return this;
    }

    update() {
        this.body.setVelocityY(this.speed);
    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
}