class Player extends Phaser.GameObjects.Sprite {
    // x,y - starting sprite location
    // spriteKey - key for the sprite image asset
    // leftKey - key for moving left
    // rightKey - key for moving right
    constructor(scene, x, y, texture, frame, leftKey, rightKey, playerSpeed) {
        super(scene, x, y, texture, frame);

        this.rx = this.displayWidth/2;
        this.ry = this.displayHeight/2;
        this.left = leftKey;
        this.right = rightKey;

        this.speed = playerSpeed;
        this.hp = 3

        scene.add.existing(this);

        return this;
    }

    update() {
        // Moving left
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (this.x > (this.displayWidth/2)) {
                this.x -= this.speed;
            }
            this.angle = -90;
        }

        // Moving right
        if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (this.x < (game.config.width - (this.displayWidth/2))) {
                this.x += this.speed;
            }
            this.angle = 90;
        }
    }

}