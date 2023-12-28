import { sceneRoot } from './sceneRoot';
import './sceneRootHMR';

function update() {
  requestAnimationFrame(update);

  sceneRoot.update();
}
requestAnimationFrame(update);
