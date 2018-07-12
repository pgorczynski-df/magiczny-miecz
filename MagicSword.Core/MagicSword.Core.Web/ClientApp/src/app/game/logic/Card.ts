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

  constructor(public definition: CardDefinition, resourcePath: string, width: number, aspect: number, height: number, delay = false) {
    super(resourcePath + "/" + definition.imageUrl, width, aspect, height, delay);
  }

  get name() {
    return this.definition ? this.definition.name : "Karta";
  }

  dispose = () => {
    this.originStack.disposeCard(this);
  }
}
