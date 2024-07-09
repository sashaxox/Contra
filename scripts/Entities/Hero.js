import { Container, Graphics } from "../../pixi/pixi.mjs";

const states = {
  Stay: "stay",
  Jump: "jump",
};

export default class Hero extends Container {
  #GRAVITY_FORCE = 0.1;
  #SPEED = 2;
  #velocityX = 0;
  #velocityY = 0;
  #JUMP_FORCE = 5;
  #movement = {
    x: 0,
    y: 0,
  };

  #directionContext = {
    left: 0,
    right: 0,
  };
  #state = states.Stay;
  constructor() {
    super();
    const view = new Graphics();
    view.rect(0, 0, 20, 60).stroke(0x00ff00);
    // view.setStrokeStyle(0x00ff00);
    this.addChild(view);
  }
  update() {
    this.#velocityX = this.#movement.x * this.#SPEED;
    this.x += this.#velocityX;
    this.#velocityY += this.#GRAVITY_FORCE;
    this.y += this.#velocityY;
  }

  stay() {
    this.#state = states.Stay
    this.#velocityY = 0;
  }
  jump() {
    if (this.#state == states.Jump) {
      return;
    }
    this.#state = states.Jump

    this.#velocityY -= this.#JUMP_FORCE;
  }
  startLeftMove() {
    this.#directionContext.left = -1;
    this.#movement.x = -1;
    if (this.#directionContext.right > 0) {
      this.#movement.x = 0;
      return;
    }
  }
  startRightMove() {
    if (this.#directionContext.left < 0) {
      this.#movement.x = 0;
      return;
    }
    this.#directionContext.right = 1;

    this.#movement.x = 1;
  }
  stopLeftMove() {
    this.#directionContext.left = 0;
    this.#movement.x = this.#directionContext.right;
  }
  stopRightMove() {
    this.#directionContext.right = 0;
    this.#movement.x = this.#directionContext.left;
  }
}
