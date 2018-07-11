import { BoxObject } from "../BoxObject";
import {CardStack} from "./CardStack";
import {CardDefinition} from "./CardDefinition";
import {IActor} from "./IActor";

export class Card extends BoxObject implements IActor {

  selectable: boolean = true;
  draggable: boolean = true;
  isCardStack: boolean = false;

  originStack: CardStack;

  definition: CardDefinition;

  constructor(topTexture: string, width: number, aspect: number, height: number, delay = false) {
    super(topTexture, width, aspect, height, delay);
  }

  get name() {
    return this.definition ? this.definition.name : "Karta";
  }
  
}
