import { Container, Graphics } from "../../pixi/pixi.mjs";

export default class Platform extends Container {
  constructor() {
    super();
    const view = new Graphics();
    view.rect(0, 0, 200, 30).stroke(0xff0000);
    // view.setStrokeStyle(0x00ff00);
    this.addChild(view);
  }
}
