import { Container, Graphics } from "../../../lib/pixi.mjs";

export default class HeroView extends Container {
  #bound = {
    width: 20,
    height: 90,
  };
  #collisionBox = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  #stm = {
    currentState: "default",
    states: {},
  };
  #rootNode;
  constructor() {
    super();

    this.#createNodeStructure();

    this.#rootNode.pivot.x = 10;
    this.#rootNode.x = 10;

    this.#bound.width = 20;
    this.#bound.height = 90;
    this.#collisionBox.width = this.#bound.width;
    this.#collisionBox.height = this.#bound.height;
    this.addChild(this.#rootNode);

    this.#stm.states.stay = this.#getStayImage();
    this.#stm.states.stayUp = this.#getStayUpImage();
    this.#stm.states.run = this.#getRunImage();
    this.#stm.states.runUp = this.#getRunUpImage();
    this.#stm.states.runDown = this.#getRunDownImage();
    this.#stm.states.lay = this.#getLayImage();
    this.#stm.states.jump = this.#getJumpImage();
    this.#stm.states.fall = this.#getFallImage();

    for (let key in this.#stm.states) {
      this.#rootNode.addChild(this.#stm.states[key]);
    }
  }

  get collisionBox() {
    this.#collisionBox.x = this.x;
    this.#collisionBox.y = this.y;
    return this.#collisionBox;
  }

  showStay() {
    this.#toState("stay");
  }
  showStayUp() {
    this.#toState("stayUp");
  }
  showRun() {
    this.#toState("run");
  }
  showRunUp() {
    this.#toState("runUp");
  }
  showRunDown() {
    this.#toState("runDown");
  }
  showLay() {
    this.#toState("lay");
  }
  showJump() {
    this.#toState("jump");
  }
  showFall() {
    this.#toState("fall");
  }
  flip(direction) {
    switch (direction) {
      case 1:
      case -1:
        this.#rootNode.scale.x = direction;
    }
  }

  #toState(key) {
    if (this.#stm.currentState == key) {
      return;
    }
    for (let key in this.#stm.states) {
      this.#stm.states[key].visible = false;
    }
    this.#stm.states[key].visible = true;

    this.#stm.currentState = key;
  }

  #createNodeStructure() {
    const rootNode = new Container();
    this.addChild(rootNode);
    this.#rootNode = rootNode;
  }

  #getStayImage() {
    const view = new Graphics();
    view.rect(0, 0, 20, 90).stroke(0xffff00);
    view.rect(0, 30, 60, 10).stroke(0xff00);
    return view;
  }

  #getStayUpImage() {
    const view = new Graphics();
    view.rect(0, 0, 20, 90).stroke(0xffff00);
    view.rect(8, -40, 5, 40).stroke(0xff00);
    return view;
  }
  #getRunImage() {
    const view = new Graphics();
    view.rect(0, 0, 20, 90).stroke(0xffff00);
    view.rect(0, 30, 70, 5).stroke(0xff00);
    view.skew.x = -0.1;
    return view;
  }
  #getRunUpImage() {
    const view = new Graphics();
    view.rect(0, 0, 20, 90).stroke(0xffff00);
    view.lineTo(0, 30).stroke("white");
    view.lineTo(40, -20).stroke("white");
    view.lineTo(45, -15).stroke("white");
    view.lineTo(0, 40).stroke("white");
    view.skew.x = -0.1;
    return view;
  }
  #getRunDownImage() {
    const view = new Graphics();
    view.rect(0, 0, 20, 90).stroke(0xffff00);
    view.lineTo(0, 20).stroke("white");
    view.lineTo(40, 60).stroke("white");
    view.lineTo(35, 65).stroke("white");
    view.lineTo(0, 30).stroke("white");
    view.skew.x = -0.1;
    return view;
  }
  #getLayImage() {
    const view = new Graphics();
    view.rect(0, 0, 90, 20).stroke(0xffff00);
    view.rect(90, 0, 40, 5).stroke("white");
    view.x -= 45;
    view.y += 70;
    return view;
  }
  #getJumpImage() {
    const view = new Graphics();
    view.rect(0, 0, 40, 40).stroke(0xffff00);
    view.x -= 15;
    view.y += 25;
    return view;
  }
  #getFallImage() {
    const view = new Graphics();
    view.rect(0, 0, 20, 90).stroke(0xffff00);
    view.rect(10, 20, 5, 60).stroke("white");
    view.skew.x = -0.1;
    return view;
  }
}
