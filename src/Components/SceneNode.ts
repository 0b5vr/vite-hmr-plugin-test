import { Component } from './Component';

export class SceneNode extends Component {
  public children: Component[];

  constructor() {
    super();

    this.children = [];
  }

  dispose() {
    // do nothing
  }

  update() {
    for (const child of this.children) {
      child.update();
    }
  }

  copy(source: any): void {
    this.children = source.children ?? [];
  }
}
