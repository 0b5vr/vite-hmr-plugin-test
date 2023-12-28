import { Component } from './Component';
import { frameCounterTitle } from './frameCounterTitle';

export class FrameCounter extends Component {
  public frameCount: number;
  public div: HTMLDivElement;

  constructor() {
    super();

    this.frameCount = 0;

    this.div = document.createElement('div');
    document.body.appendChild(this.div);
  }

  dispose() {
    this.div.remove();
  }

  update() {
    this.frameCount ++;
    this.div.innerText = `${frameCounterTitle}: ${this.frameCount.toString()}`;
  }

  copy(source: any): void {
    this.frameCount = source.frameCount ?? 0;
  }
}
