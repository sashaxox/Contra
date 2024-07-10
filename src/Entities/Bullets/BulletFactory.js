import { Graphics } from "../../../lib/pixi.mjs";
import Bullet from "./Bullet.js";

export default class BulletFactory {
  #worldContainer;
  #entities;
  constructor(worldContainer, entities) {
    this.#worldContainer = worldContainer;
    this.#entities = entities;
  }
  createBullet(bulletContext) {
    const bullet = new Bullet(bulletContext.angle);
    bullet.x = bulletContext.x;
    bullet.y = bulletContext.y;
    return bullet;
  }
}
