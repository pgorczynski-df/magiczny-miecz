import { BoxObject } from "../BoxObject";

export class GameBoard extends BoxObject {

  constructor(topTexture: string, width: number, aspect: number, height: number) {
    super(topTexture, width, aspect, height);
  }

  public register(scene: THREE.Scene): void {
    super.register(scene);
  }

}
