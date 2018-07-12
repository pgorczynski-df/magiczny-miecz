import { BoxObject } from "../BoxObject";
import {CardDefinition} from "./CardDefinition";
import {Card} from "./Card";
import {IActor} from "./IActor";
import {CardStackDefinition} from "./CardStackDefinition";

export class CardStack extends BoxObject implements IActor  {

  selectable: boolean = true;
  draggable: boolean = true;
  isCard: boolean = false;
  isCardStack: boolean = true;

  get name() { return this.definition.name; }
  get type() { return this.definition.type; }

  cards: Card[] = [];

  drawnCards: Card[] = [];

  disposedCards: Card[] = [];

  constructor(public definition: CardStackDefinition, width: number, aspect: number, height: number) {
    super(definition.resourcePath + "/" + definition.imageUrl, width, aspect, height);
  }

  buildStack = () => {
    if (!this.definition.cardDefinitions) {
      throw new Error("cardDefinitions not set");
    }

    for (var cardDefinition of this.definition.cardDefinitions) {
      for (let i = 0; i < cardDefinition.multiplicity; i++) {
        var card = new Card(cardDefinition, this.definition.resourcePath, this.width, this.aspect, 0.5, true);
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

    this.drawnCards.push(card);

    return card;
  }

  public disposeCard = (card: Card) => {
    this.drawnCards = this.drawnCards.filter(obj => obj !== card);
    this.disposedCards.push(card);
    card.unload();
  }
}
