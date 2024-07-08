import Hero from "./Entities/Hero.js";
import Platform from "./Entities/Platform.js";

export default class Game {
  #pixiApp;
  #hero;
  #platforms = [];
  constructor(pixiApp) {
    this.#pixiApp = pixiApp;

    this.#hero = new Hero();
    this.#hero.x = 200;
    this.#hero.y = 100;
    this.#pixiApp.stage.addChild(this.#hero);

    const platform1 = new Platform();
    platform1.x = 50;
    platform1.y = 400;
    this.#pixiApp.stage.addChild(platform1);

    const platform2 = new Platform();
    platform2.x = 200;
    platform2.y = 450;
    this.#pixiApp.stage.addChild(platform2);

    const platform3 = new Platform();
    platform3.x = 400;
    platform3.y = 400;
    this.#pixiApp.stage.addChild(platform3);

    this.#platforms.push(platform1, platform2, platform3);
  }
  update() {
    const prevPoint = { y: this.#hero.y, x: this.#hero.x };
    this.#hero.update();
    for (let i = 0; i < this.#platforms.length; i++) {
      if (!this.isCheckAABB(this.#hero, this.#platforms[i])) {
        continue;
      }
      const currY = this.#hero.y;
      this.#hero.y = prevPoint.y;
      if (!this.isCheckAABB(this.#hero, this.#platforms[i])) {
        this.#hero.stay();
        continue;
      }
      this.#hero.y = currY;
      this.#hero.x = prevPoint.x;
    }
  }
  isCheckAABB(entity, area) {
    return (
      entity.x < area.x + area.width &&
      entity.x + entity.width > area.x &&
      entity.y < area.y + area.height &&
      entity.y + entity.height > area.y
    );
  }
}
