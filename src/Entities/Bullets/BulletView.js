import { Container, Graphics } from "../../../lib/pixi.mjs";

export default class BulletView extends Container {
  #collisionBox = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  constructor() {
    super();

    this.#collisionBox.width = 5;
    this.#collisionBox.height = 5;

    const view = new Graphics();
    view.rect(0, 0, 5, 5).stroke(0xffff00);
    this.addChild(view);
  }

  get collisionBox() {
    this.#collisionBox.x = this.x;
    this.#collisionBox.y = this.y;
    return this.#collisionBox;
  }

  get hitBox() {
    return this.collisionBox;
  }
}
