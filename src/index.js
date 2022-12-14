import Phaser from "phaser";
import sky from "./assets/sky.png";
import platform from "./assets/platform.png";
import star from "./assets/star.png";
import bomb from "./assets/bomb.png";
import dude from "./assets/dude.png";
import createLevel from "./util/createLevel";

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
    const platformPositions = [
      [600, 400],
      [50, 250],
      [750, 220],
    ];
    const level = createLevel(this, platformPositions, "sky");

    // Set player
    this.player = this.physics.add.sprite(100, 450, "dude");
    //this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, level);

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

    // Create stars
    const stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });
    stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    // Stars collision
    this.physics.add.collider(stars, level);
    this.physics.add.overlap(this.player, stars, collect, null, this);

    function collect(player, star) {
      star.disableBody(true, true);
      score += 1;
      scoreText.setText("Score: " + score);

      if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {
          child.enableBody(true, child.x, 0, true, true);
        });

        const x =
          player.x < 400
            ? Phaser.Math.Between(400, 800)
            : Phaser.Math.Between(0, 400);
        const bomb = bombs.create(x, 16, "bomb");
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      }
    }

    // Create bombs
    const bombs = this.physics.add.group();
    this.physics.add.collider(bombs, level);
    this.physics.add.collider(this.player, bombs, bombTouched, null, this);

    function bombTouched(player, bomb) {
      this.physics.pause();
      this.player.setTint(0xff000);
      this.player.anims.play("turn");
    }

    // Score text
    const scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: 32,
      fill: "#000",
    });
    let score = 0;
  }

  update() {
    // Set up player movement
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
    // Jump
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
