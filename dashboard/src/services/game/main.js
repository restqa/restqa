import Phaser from 'phaser';
import { ScenePreloadAssets } from "./Scenes/ScenePreloadAssets";
import { KUBE_Game } from './KUBE_Game';
import { CST } from './CST';

function launch(containerId) {
  return new KUBE_Game({
    type: Phaser.AUTO,
    width: CST.GAME.WIDTH,
    height: CST.GAME.HEIGHT,
    /*
    scale: {
        parent: document.body,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    */
    dom: { createContainer: true },
    scene: [ScenePreloadAssets],
    render: { pixelArt: false },
    parent: containerId,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: CST.PHYSIC.GRAVITY},
            debug: false
        }
    }
  });
}

export default launch
export { launch }
