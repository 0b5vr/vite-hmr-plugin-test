import { Component } from './Components/Component';
import { SceneNode } from './Components/SceneNode';
import { sceneRoot } from './sceneRoot';

function traverseAndReplace(
  mod: any,
  classNamesSet: Set<string>,
  parent: SceneNode | null,
  component: Component,
  index: number,
) {
  if (classNamesSet.has(component.constructor.name)) {
    if (parent == null) {
      location.reload();
      return;
    }

    const newComponent = new mod[component.constructor.name]();
    newComponent.copy(component);

    parent.children[index] = newComponent;
    component.dispose();
  }

  if (component instanceof SceneNode) {
    for (const [index, child] of component.children.entries()) {
      traverseAndReplace(mod, classNamesSet, component, child, index);
    }
  }
}

if (import.meta.hot) {
  window.hotComponentObservers ??= new Set();
  window.hotComponentObservers.add((event) => {
    const classNamesSet = new Set(event.classNames);
    traverseAndReplace(event.mod, classNamesSet, null, sceneRoot, 0);
  });
}
