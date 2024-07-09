import Hero from "./Entities/Hero/Hero.js";
import KeyboardProcessor from "./Entities/KeyboardProcessor.js";
import PlatformFactory from "./Entities/platforms/PlatformFactory.js";

export default class Game {
  #pixiApp;
  #hero;
  #platforms = [];

  keyboardProcessor;
  constructor(pixiApp) {
    this.#pixiApp = pixiApp;

    this.#hero = new Hero(this.#pixiApp.stage);
    this.#hero.x = 200;
    this.#hero.y = 100;
    // this.#pixiApp.stage.addChild(this.#hero);

    const platformFactory = new PlatformFactory(this.#pixiApp);

    const box = platformFactory.createBox(400, 708);
    box.isStep = true;
    this.#platforms.push(
      platformFactory.createPlatform(100, 400),
      platformFactory.createPlatform(300, 400),
      platformFactory.createPlatform(500, 400),
      platformFactory.createPlatform(700, 400),
      platformFactory.createPlatform(900, 400),
      platformFactory.createPlatform(300, 550),
      platformFactory.createBox(0, 738),
      platformFactory.createBox(200, 738),
      box
    );
    this.keyboardProcessor = new KeyboardProcessor(this);
    this.setKeys();
  }
  update() {
    const prevPoint = { y: this.#hero.y, x: this.#hero.x };
    this.#hero.update();
    for (let i = 0; i < this.#platforms.length; i++) {
      if (this.#hero.isJumpState() && this.#platforms[i].type != "box") {
        continue;
      }
      const collisionResult = this.getPlatformCollisionResult(
        this.#hero,
        this.#platforms[i],
        prevPoint
      );
      if (collisionResult.vertical == true) {
        this.#hero.stay(this.#platforms[i].y);
      }
    }
  }

  getPlatformCollisionResult(character, platform, prevPoint) {
    const collisionResult = this.getOrientCollisionResult(
      character.collisionBox,
      platform,
      prevPoint
    );
    if (collisionResult.vertical == true) {
      character.y = prevPoint.y;
    }
    if (collisionResult.horizontal == true && platform.type == "box") {
      if (platform.isStep) {
        character.stay(platform.y);
      }
      character.x = prevPoint.x;
    }

    return collisionResult;
  }
  getOrientCollisionResult(aaRect, bbRect, aaPrevPoint) {
    const collisionResult = {
      horizontal: false,
      vertical: false,
    };
    if (!this.isCheckAABB(aaRect, bbRect)) {
      return collisionResult;
    }
    aaRect.y = aaPrevPoint.y;
    if (!this.isCheckAABB(aaRect, bbRect)) {
      collisionResult.vertical = true;
      return collisionResult;
    }
    collisionResult.horizontal = true;
    return collisionResult;
  }

  isCheckAABB(entity, area) {
    return (
      entity.x < area.x + area.width &&
      entity.x + entity.width > area.x &&
      entity.y < area.y + area.height &&
      entity.y + entity.height > area.y
    );
  }

  setKeys() {
    this.keyboardProcessor.getButton("KeyS").executeDown = function () {
      if (this.keyboardProcessor.isButtonPressed("ArrowDown")) {
        this.#hero.throwDown();
      } else {
        this.#hero.jump();
      }
    };
    this.keyboardProcessor.getButton("ArrowLeft").executeDown = function () {
      this.#hero.startLeftMove();
    };
    this.keyboardProcessor.getButton("ArrowLeft").executeUp = function () {
      this.#hero.stopLeftMove();
    };
    this.keyboardProcessor.getButton("ArrowRight").executeDown = function () {
      this.#hero.startRightMove();
    };
    this.keyboardProcessor.getButton("ArrowRight").executeUp = function () {
      this.#hero.stopRightMove();
    };
  }
}
