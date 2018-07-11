import {CardDefinition} from "./CardDefinition";
import {Game} from "../Game";

export class CardStackDefinition {

  id: number;

  name: string;

  type: string;

  resourcePath: string;

  imageUrl: string;

  cardDefinitionsUrl: string;

  cardDefinitions: CardDefinition[];


}
