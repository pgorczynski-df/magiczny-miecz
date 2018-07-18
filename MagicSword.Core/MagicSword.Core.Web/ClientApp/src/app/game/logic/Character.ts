import {Card} from "./Card";
import {CardDefinition} from "./CardDefinition";

export class Character extends Card {

  constructor(definition: CardDefinition, resourcePath: string, width: number, height: number, depth: number, delay = false) {
    super(definition, resourcePath, width, height, depth, delay);
  }

}
