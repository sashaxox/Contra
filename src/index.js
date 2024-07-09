import * as PIXI from "../lib/pixi.mjs";
import Game from "./Game.js";
const app = new PIXI.Application();

async function init() {
  await app.init({ background: "0x000000", width: 1024, height: 768 });

  const game = new Game(app);

  app.ticker.add(() => {
    game.update();
  });

  document.body.appendChild(app.canvas);

  document.addEventListener("keydown", function (key) {
    game.keyboardProcessor.onKeyDown(key);
  });

  document.addEventListener("keyup", function (key) {
    game.keyboardProcessor.onKeyUp(key);
  });
}

init();
