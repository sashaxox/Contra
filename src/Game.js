import { Container } from "../lib/pixi.mjs";
import Camera from "./Camera.js";
import BulletFactory from "./Entities/Bullets/BulletFactory.js";
import RunnerFactory from "./Entities/Enemies/Runner/RunnerFactory.js";
import KeyboardProcessor from "./KeyboardProcessor.js";
import PlatformFactory from "./Entities/platforms/PlatformFactory.js";
import HeroFactory from "./Entities/Hero/HeroFactory.js";
import Physics from "./Physics.js";
import TourelleFactory from "./Entities/Enemies/Tourelle/TourelleFactory.js";
import Weapon from "./Weapon.js";

export default class Game {
  #pixiApp;
  #hero;
  #platforms = [];
  #entities = [];
  #camera;
  #bulletFactory;
  #worldContainer;
  #runnerFactory;
  #weapon;

  keyboardProcessor;

  constructor(pixiApp) {
    this.#pixiApp = pixiApp;

    this.#worldContainer = new Container();
    this.#pixiApp.stage.addChild(this.#worldContainer);

    this.#bulletFactory = new BulletFactory(
      this.#worldContainer, //.game
      this.#entities
    );

    const heroFactory = new HeroFactory(this.#worldContainer);
    this.#hero = heroFactory.create(100, 100);
    this.#entities.push(this.#hero);

    // const runnerFactory = new RunnerFactory(
    //   this.#worldContainer, //.game
    //   this.#hero,
    //   this.#bulletFactory,
    //   this.#entities,
    //   assets
    // );

    const platformFactory = new PlatformFactory(this.#worldContainer);
    const box = platformFactory.createBox(400, 708);
    box.isStep = true;
    this.#platforms.push(
      platformFactory.createPlatform(100, 400),
      // platformFactory.createPlatform(300, 400),
      platformFactory.createPlatform(500, 400),
      platformFactory.createPlatform(700, 400),
      platformFactory.createPlatform(900, 400),
      platformFactory.createPlatform(1100, 500),
      platformFactory.createPlatform(1200, 600),
      platformFactory.createPlatform(1400, 600),
      platformFactory.createPlatform(1800, 600),

      platformFactory.createPlatform(300, 550),
      platformFactory.createBox(0, 738),
      platformFactory.createBox(200, 738),
      platformFactory.createBox(600, 738),
      platformFactory.createBox(1000, 738),
      box
    );
    const cameraSettings = {
      target: this.#hero,
      world: this.#worldContainer,
      screenSize: this.#pixiApp.screen,
      maxWorldWidth: this.#worldContainer.width,
      isBackScrollX: false,
    };

    this.#camera = new Camera(cameraSettings);
    this.#weapon = new Weapon(this.#bulletFactory);
    this.#weapon.setWeapon(1);

    this.keyboardProcessor = new KeyboardProcessor(this);
    this.setKeys();

    this.#bulletFactory = new BulletFactory(this.#worldContainer);
    this.#runnerFactory = new RunnerFactory(this.#worldContainer);
    this.#entities.push(this.#runnerFactory.create(800, 150));
    this.#entities.push(this.#runnerFactory.create(900, 150));
    this.#entities.push(this.#runnerFactory.create(1200, 150));
    this.#entities.push(this.#runnerFactory.create(1600, 150));
    const tourelleFactory = new TourelleFactory(
      this.#worldContainer,
      this.#hero,
      this.#bulletFactory
    );
    this.#entities.push(tourelleFactory.create(500, 200));
  }

  update() {
    for (let i = 0; i < this.#entities.length; i++) {
      const entity = this.#entities[i];
      entity.update();

      if (entity.type == "hero" || entity.type == "enemy") {
        //|| entity.type == "powerupBox" || entity.type == "spreadgunPowerup"
        this.#checkDamage(entity);
        this.#checkPlatforms(entity);
      }

      this.#checkEntityStatus(entity, i);
    }

    this.#camera.update();
    // this.#weapon.update(this.#hero.bulletContext);

    // this.#checkGameStatus();
  }
  #checkDamage(entity) {
    const damagers = this.#entities.filter(
      (damager) =>
        (entity.type == "enemy" && //|| entity.type == "powerupBox")
          damager.type == "heroBullet") || //
        (entity.type == "hero" &&
          (damager.type == "enemyBullet" || damager.type == "enemy"))
    );

    for (let damager of damagers) {
      if (Physics.isCheckAABB(damager.hitBox, entity.hitBox)) {
        entity.damage();
        if (damager.type != "enemy") {
          damager.dead();
        }

        break;
      }
    }
  }
  #checkPlatforms(character) {
    if (character.isDead || !character.gravitable) {
      return;
    }

    for (let platform of this.#platforms) {
      if (
        (character.isJumpState() && platform.type != "box") ||
        !platform.isActive
      ) {
        continue;
      }
      this.checkPlatformCollision(character, platform);
    }

    if (character.type == "hero" && character.x < -this.#worldContainer.x) {
      character.x = character.prevPoint.x;
    }
  }
  #checkEntityStatus(entity, index) {
    if (entity.isDead || this.#isScreenOut(entity)) {
      entity.removeFromStage();
      this.#entities.splice(index, 1);
    }
  }
  #isScreenOut(entity) {
    if (entity.type == "heroBullet" || entity.type == "enemyBullet") {
      return (
        entity.x > this.#pixiApp.screen.width - this.#worldContainer.x ||
        entity.x < -this.#worldContainer.x ||
        entity.y > this.#pixiApp.screen.height ||
        entity.y < 0
      );
    } else if (entity.type == "enemy" || entity.type == "hero") {
      return (
        entity.x < -this.#worldContainer.x ||
        entity.y > this.#pixiApp.screen.height
      );
    }
  }
  checkPlatformCollision(character, platform) {
    const prevPoint = character.prevPoint;
    const collisionResult = Physics.getOrientCollisionResult(
      character.collisionBox,
      platform,
      prevPoint
    );
    if (collisionResult.vertical == true) {
      character.y = prevPoint.y;
      character.stay(platform.y);
    }
    if (collisionResult.horizontal == true && platform.type == "box") {
      if (platform.isStep) {
        character.stay(platform.y);
      } else {
        character.x = prevPoint.x;
      }
    }
  }

  setKeys() {
    this.keyboardProcessor.getButton("KeyA").executeDown = function () {
      if (!this.#hero.isDead && !this.#hero.isFall) {
        const bullets = this.#entities.filter(
          (bullet) => bullet.type == this.#hero.bulletContext.type
        );
        if (bullets.length > 10) {
          return;
        }
        this.#weapon.startFire();
        this.#hero.setView(this.getArrowButtonContext());
      }
    };
    this.keyboardProcessor.getButton("KeyA").executeUp = function () {
      if (!this.#hero.isDead && !this.#hero.isFall) {
        this.#weapon.stopFire();
        this.#hero.setView(this.getArrowButtonContext());
      }
    };

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
    arrowLeft.executeDown = function () {
      this.#hero.startLeftMove();
      this.#hero.setView(this.getArrowButtonContext());
    };
    arrowLeft.executeUp = function () {
      this.#hero.stopLeftMove();
      this.#hero.setView(this.getArrowButtonContext());
    };

    const arrowRight = this.keyboardProcessor.getButton("ArrowRight");
    arrowRight.executeDown = function () {
      this.#hero.startRightMove();
      this.#hero.setView(this.getArrowButtonContext());
    };
    arrowRight.executeUp = function () {
      this.#hero.stopRightMove();
      this.#hero.setView(this.getArrowButtonContext());
    };

    const arrowUp = this.keyboardProcessor.getButton("ArrowUp");
    arrowUp.executeDown = function () {
      this.#hero.setView(this.getArrowButtonContext());
    };
    arrowUp.executeUp = function () {
      this.#hero.setView(this.getArrowButtonContext());
    };

    const arrowDown = this.keyboardProcessor.getButton("ArrowDown");
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
    buttonContext.shoot = this.keyboardProcessor.isButtonPressed("KeyA");
    return buttonContext;
  }
}
