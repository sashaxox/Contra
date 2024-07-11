import { Graphics } from "../../../lib/pixi.mjs";
import Bullet from "./Bullet.js";
import BulletView from "./BulletView.js";
// import GravitableBullet from "./GravitableBullet.js";

export default class BulletFactory {
  #worldContainer;
  #entities;

  constructor(worldContainer, entities) {
    
    this.#worldContainer = worldContainer;
    this.#entities = entities;
  }

  createBullet(bulletContext) {
    const skin = new Graphics();
    skin.rect(0, 0, 5, 5).fill(0xffffff);

    const view = new BulletView();
    view.addChild(skin);

    this.#worldContainer.addChild(view);

    const bullet = new Bullet(view, bulletContext.angle);
    bullet.x = bulletContext.x;
    bullet.y = bulletContext.y;
    bullet.type = bulletContext.type;
    bullet.speed = 10;

    this.#entities.push(bullet);
  }

  createSpreadGunBullet(bulletContext) {
    const skin = new Graphics();
    skin.Circle(0, 0, 6).fill(0xff2222);
    skin.Circle(-3, -3, 3).fill(0xdddddd);

    const view = new BulletView();
    view.addChild(skin);

    this.#worldContainer.addChild(view);

    const bullet = new Bullet(view, bulletContext.angle);
    bullet.x = bulletContext.x;
    bullet.y = bulletContext.y;
    bullet.type = bulletContext.type;
    bullet.speed = 7;

    this.#entities.push(bullet);
  }

  createBossBullet(bulletContext) {
    const skin = new Graphics();
    skin.Circle(0, 0, 6).fill(0xff2222);
    skin.Circle(-3, -3, 3).fill(0xdddddd);

    const view = new BulletView();
    view.addChild(skin);

    this.#worldContainer.addChild(view);

    const bullet = new GravitableBullet(view);
    bullet.x = bulletContext.x;
    bullet.y = bulletContext.y;
    bullet.type = bulletContext.type;
    bullet.speed = Math.random() * -6 - 2;

    this.#entities.push(bullet);
  }
}
