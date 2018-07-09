import { BoxObject } from "../BoxObject";
import {CardStack} from "./CardStack";

export class Card extends BoxObject {

  private originStack: CardStack;

  constructor(topTexture: string, width: number, aspect: number, height: number) {
    super(topTexture, width, aspect, height);
  }

  public register(scene: THREE.Scene): void {
    super.register(scene);
  }

}
