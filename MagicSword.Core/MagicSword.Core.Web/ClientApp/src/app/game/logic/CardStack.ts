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

  public buildStack = () => {
    if (!this.definition.cardDefinitions) {
      throw new Error("cardDefinitions not set");
    }

    for (var cardDefinition of this.definition.cardDefinitions) {
      for (let i = 0; i < cardDefinition.multiplicity; i++) {
        var card = this.createCardInternal(cardDefinition, true);
        this.cards.push(card);
      }
    }

    //TODO shuffle
  }

  public createCard = (definitionId: number, delay: boolean) => {
    var definition = this.findDefinition(definitionId);
    var card = this.createCardInternal(definition, delay);
    return card;
  }

  private findDefinition = (definitionId: number) => {
    return this.definition.cardDefinitions.find(s => s.id === definitionId);
  }

  private createCardInternal = (cardDefinition: CardDefinition, delay: boolean) => {
    var card = new Card(cardDefinition, this.definition.resourcePath, this.width, this.aspect, 0.5, delay);
    card.originStack = this;
    return card;
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

  public cleanup = () => {
    this.cards = [];
    this.drawnCards = [];
    this.disposedCards = [];

    this.object3D.position.copy(this.definition.initialPosition);
    this.object3D.rotation.copy(this.definition.initialRotation);
  }
}
