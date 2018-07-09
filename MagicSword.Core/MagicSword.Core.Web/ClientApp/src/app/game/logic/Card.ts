import { BoxObject } from "../BoxObject";
import {CardStack} from "./CardStack";
import {CardDefinition} from "./CardDefinition";

export class Card extends BoxObject {

  private originStack: CardStack;

  definition: CardDefinition;

  constructor(topTexture: string, width: number, aspect: number, height: number) {
    super(topTexture, width, aspect, height);
  }

  public register(scene: THREE.Scene): void {
    super.register(scene);
  }

}
