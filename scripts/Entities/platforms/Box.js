import { Container, Graphics } from "../../../pixi/pixi.mjs";

export default class Box extends Container {
    type = "box"
  constructor() {
    super();
    const view = new Graphics();
    view.rect(0, 0, 200, 30).stroke(0xff0000);
    view.lineTo(200, 30)
    view.stroke("yellow")
    this.addChild(view);
  }
}
