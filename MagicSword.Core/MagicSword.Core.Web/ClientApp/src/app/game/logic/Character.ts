import {Card} from "./Card";

export class Character extends Card {

  constructor(topTexture: string, width: number, aspect: number, height: number) {
    super(topTexture, width, aspect, height);
  }

  public register(scene: THREE.Scene): void {
    super.register(scene);
  }

}
