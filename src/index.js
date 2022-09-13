import Phaser from "phaser";
import sky from "./assets/sky.png";
import platform from "./assets/platform.png";
import star from "./assets/star.png";
import bomb from "./assets/bomb.png";
import dude from "./assets/dude.png";

class MyGame extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    // Load flat images
    this.load.image("sky", sky);
    this.load.image("star", star);
    this.load.image("platform", platform);
    this.load.image("bomb", bomb);
    // Load spritesheets
    this.load.spritesheet("dude", dude, {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    this.add.image(400, 300, "sky");

    const platforms = this.physics.add.staticGroup();
    // Create base platform
    platforms.create(400, 568, "platform").setScale(2).refreshBody();
    // Create level platforms
    platforms.create(600, 400, "platform");
    platforms.create(50, 250, "platform");
    platforms.create(750, 220, "platform");

    // Set player
    this.player = this.physics.add.sprite(100, 450, "dude");
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, platforms);

    // Animation
    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  update() {
    const cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("left", true);
    } else if (cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn", true);
    }

    if (cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-420);
    }
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 450 },
      debug: false,
    },
  },
  scene: MyGame,
};

const game = new Phaser.Game(config);
