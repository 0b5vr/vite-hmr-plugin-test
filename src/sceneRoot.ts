import { FrameCounter } from './Components/FrameCounter';
import { SceneNode } from './Components/SceneNode';

export const sceneRoot = new SceneNode();

sceneRoot.children.push(new FrameCounter());
