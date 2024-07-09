import Hero from "./Entities/Hero.js";
import KeyboardProcessor from "./Entities/KeyboardProcessor.js";
import PlatformFactory from "./Entities/platforms/PlatformFactory.js";
// import Platform from "./Entities/Platform.js";

export default class Game {
  #pixiApp;
  #hero;
  #platforms = [];

  keyboardProcessor;
  constructor(pixiApp) {
    this.#pixiApp = pixiApp;

    this.#hero = new Hero();
    this.#hero.x = 200;
    this.#hero.y = 100;
    this.#pixiApp.stage.addChild(this.#hero);

    const platformFactory = new PlatformFactory(this.#pixiApp);

    this.#platforms.push(
      platformFactory.createPlatform(50, 400),
      platformFactory.createPlatform(200, 450),
      platformFactory.createPlatform(400, 400)
    );
    this.keyboardProcessor = new KeyboardProcessor(this);
    this.keyboardProcessor.getButton("KeyS").executeDown = function () {
      this.#hero.jump();
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
  update() {
    const prevPoint = { y: this.#hero.y, x: this.#hero.x };
    this.#hero.update();
    for (let i = 0; i < this.#platforms.length; i++) {
      const collisionResult = this.getPlatformCollisionResult(
        this.#hero,
        this.#platforms[i],
        prevPoint
      );
      if (collisionResult.vertical == true) {
        this.#hero.stay();
      }
    }
  }

  getPlatformCollisionResult(character, platform, prevPoint) {
    const collisionResult = {
      horizontal: false,
      vertical: false,
    };
    if (!this.isCheckAABB(character, platform)) {
      return collisionResult;
    }
    const currY = character.y;
    character.y = prevPoint.y;
    if (!this.isCheckAABB(character, platform)) {
      collisionResult.vertical = true;
      return collisionResult;
    }
    character.y = currY;
    character.x = prevPoint.x;
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
}
