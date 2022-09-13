function createLevel(game, platformArray, background) {
  game.add.image(400, 300, background);
  const platforms = game.physics.add.staticGroup();
  // Create base platform
  platforms.create(400, 568, "platform").setScale(2).refreshBody();
  // Create level platforms
  for (let platform of platformArray) {
    platforms.create(platform[0], platform[1], "platform");
  }
  return platforms;
}

export default createLevel;
