import RunnerView from "./RunnerView.js";

const States = {
  Stay: "stay",
  Jump: "jump",
  FlyDown: "flydown",
};

export default class Runner {
  #GRAVITY_FORCE = 0.2;
  #SPEED = 3;
  #velocityX = 0;
  #velocityY = 0;
  #JUMP_FORCE = 9;
  #movement = {
    x: 0,
    y: 0,
  };

  #state = States.Stay;

  #view;

  #prevPoint = {
    x: 0,
    y: 0,
  };
  constructor(stage) {
    this.#view = new RunnerView();
    stage.addChild(this.#view);
    this.#state = States.Jump;
    this.#view.showJump();

    this.#movement.x = -1;
  }

  get x() {
    return this.#view.x;
  }
  set x(value) {
    this.#view.x = value;
  }

  get y() {
    return this.#view.y;
  }
  set y(value) {
    this.#view.y = value;
  }

  get collisionBox() {
    return this.#view.collisionBox;
  }

  get prevPoint() {
    return this.#prevPoint;
  }
  update() {
    this.#prevPoint.x = this.x;
    this.#prevPoint.y = this.y;

    this.#velocityX = this.#movement.x * this.#SPEED;
    this.x += this.#velocityX;

    if (this.#velocityY > 0) {
      if (!(this.#state == States.Jump || this.#state == States.FlyDown)) {
        if (Math.random() > 0.4) {
          this.#view.showFall();
        } else {
          this.jump();
        }
      }
      if (this.#velocityY > 0) {
        this.#state = States.FlyDown;
      }
    }

    this.#velocityY += this.#GRAVITY_FORCE;
    this.y += this.#velocityY;
  }

  stay(platformY) {
    if (this.#state == States.Jump || this.#state == States.FlyDown) {
      const fakeButtonContext = {};
      fakeButtonContext.arrowLeft = this.#movement.x == -1;
      fakeButtonContext.arrowRight = this.#movement.x == 1;
      this.#state = States.Stay;
      this.setView(fakeButtonContext);
    }

    this.#state = States.Stay;
    this.#velocityY = 0;

    this.y = platformY - this.#view.collisionBox.height;
  }

  jump() {
    if (this.#state == States.Jump || this.#state == States.FlyDown) {
      return;
    }
    this.#state = States.Jump;
    this.#velocityY -= this.#JUMP_FORCE;
    this.#view.showJump();
  }

  isJumpState() {
    return this.#state == States.Jump;
  }

  setView(buttonContext) {
    this.#view.flip(this.#movement.x);

    if (this.isJumpState() || this.#state == States.FlyDown) {
      return;
    }

    if (buttonContext.arrowLeft || buttonContext.arrowRight) {
      this.#view.showRun();
    }
  }

  removeFromParent() {
    if (this.#view.parent != null) {
      this.#view.removeFromParent();
    }
  }
}
