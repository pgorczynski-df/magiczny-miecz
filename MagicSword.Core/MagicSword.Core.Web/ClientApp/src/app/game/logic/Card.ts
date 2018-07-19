import { BoxObject } from "../BoxObject";
import {CardStack} from "./CardStack";
import {CardDefinition} from "./CardDefinition";
import {IActor} from "./IActor";

export class Card extends BoxObject implements IActor {

  selectable: boolean = true;
  draggable: boolean = true;
  isCard: boolean = true;
  isCardStack: boolean = false;

  originStack: CardStack;

  constructor(public definition: CardDefinition, resourcePath: string, width: number, height: number, depth: number, delay = false, isPawn = false) {
    super(resourcePath + "/" + definition.imageUrl, width, height, depth, delay, isPawn);
  }

  get name() {
    return this.definition ? this.definition.name : "Karta";
  }

  dispose = () => {
    this.originStack.disposeCard(this);
  }

  init(): void {
     super.init();
  }
}
