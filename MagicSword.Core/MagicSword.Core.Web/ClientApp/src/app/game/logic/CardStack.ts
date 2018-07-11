import { BoxObject } from "../BoxObject";
import {CardDefinition} from "./CardDefinition";
import {Card} from "./Card";
import {IActor} from "./IActor";

export class CardStack extends BoxObject implements IActor  {

  selectable: boolean = true;
  draggable: boolean = true;
  isCardStack: boolean = true;

  name: string;

  cardDefinitions: CardDefinition[];

  cards: Card[] = [];

  constructor(private texturePath: string, topTexture: string, width: number, aspect: number, height: number) {
    super(texturePath + "/" + topTexture, width, aspect, height);
  }

  buildStack = () => {
    if (!this.cardDefinitions) {
      throw new Error("cardDefinitions not set");
    }

    for (var def of this.cardDefinitions) {
      for (let i = 0; i < def.multiplicity; i++) {
        var card = new Card(this.texturePath + "/" + def.imageUrl, this.width, this.aspect, 0.5, true);
        card.definition = def;
        card.originStack = this;
        this.cards.push(card);
      }
    }

    //TODO shuffle
  }

  public drawCard = (): Card => {

    if (this.cards.length === 0) {
      throw new Error("Stack " + name + " is empty!");
    }

    var card = this.cards.pop();
    card.init();
    card.object3D.position.copy(this.object3D.position);

    return card;
  }


}
