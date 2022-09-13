import Phaser from "phaser";
import logoImg from "./assets/logo.png";

class MyGame extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {}

  create() {}

  update() {}
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
      debug: true,
    },
  },
  scene: MyGame,
};

const game = new Phaser.Game(config);
