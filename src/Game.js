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
      if (
        this.keyboardProcessor.isButtonPressed("ArrowDown") &&
        !(
          this.keyboardProcessor.isButtonPressed("ArrowLeft") ||
          this.keyboardProcessor.isButtonPressed("ArrowRight")
        )
      ) {
        this.#hero.throwDown();
      } else {
        this.#hero.jump();
      }
    };
    const arrowLeft = this.keyboardProcessor.getButton("ArrowLeft");
    const arrowRight = this.keyboardProcessor.getButton("ArrowRight");
    const arrowUp = this.keyboardProcessor.getButton("ArrowUp");
    const arrowDown = this.keyboardProcessor.getButton("ArrowDown");
    arrowLeft.executeDown = function () {
      this.#hero.startLeftMove();
      this.#hero.setView(this.getArrowButtonContext());
    };
    arrowLeft.executeUp = function () {
      this.#hero.stopLeftMove();
      this.#hero.setView(this.getArrowButtonContext());
    };
    arrowRight.executeDown = function () {
      this.#hero.startRightMove();
      this.#hero.setView(this.getArrowButtonContext());
    };
    arrowRight.executeUp = function () {
      this.#hero.stopRightMove();
      this.#hero.setView(this.getArrowButtonContext());
    };
    arrowUp.executeDown = function () {
      this.#hero.setView(this.getArrowButtonContext());
    };
    arrowUp.executeUp = function () {
      this.#hero.setView(this.getArrowButtonContext());
    };
    arrowDown.executeDown = function () {
      this.#hero.setView(this.getArrowButtonContext());
    };
    arrowDown.executeUp = function () {
      this.#hero.setView(this.getArrowButtonContext());
    };
  }
  getArrowButtonContext() {
    const buttonContext = {};
    buttonContext.arrowLeft =
      this.keyboardProcessor.isButtonPressed("ArrowLeft");
    buttonContext.arrowRight =
      this.keyboardProcessor.isButtonPressed("ArrowRight");
    buttonContext.arrowUp = this.keyboardProcessor.isButtonPressed("ArrowUp");
    buttonContext.arrowDown =
      this.keyboardProcessor.isButtonPressed("ArrowDown");
    return buttonContext;
  }
}
