//import * as Logger from "js-logger";

import { BoxObject } from "../BoxObject";
import { CardDefinition } from "@App/common/mechanics/definitions/CardDefinition";
import { Card } from "./Card";
import { IActor } from "./IActor";
import { CardStackDefinition } from "@App/common/mechanics/definitions/CardStackDefinition";
import { CardType } from "@App/common/mechanics/definitions/CardType";
import { Collections } from "../utils/Collections";
import { Character } from "./Character";

export class CardStack extends BoxObject implements IActor {

  static cardWidth = 0.5;

  selectable: boolean = true;
  draggable: boolean = true;

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

    if (this.definition.shuffle) {
      this.shuffle();
    }
  }

  public shuffle = () => {
    this.cards = Collections.shuffle(this.cards);
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

    //for most cards we transpose width and height
    var width = this.height;
    var height = this.width;
    var depth = CardStack.cardWidth;

    //for pawns everything is switched
    var isPawn = this.definition.type === CardType.Pawn;

    if (isPawn) {
      width = this.height;
      height = CardStack.cardWidth;
      depth = this.width;
    }

    var card = this.definition.type === CardType.Character ?
      new Character(cardDefinition, this.definition.resourcePath, width, height, depth, delay) :
      new Card(cardDefinition, this.definition.resourcePath, width, height, depth, delay, isPawn);

    card.originStack = this;
    return card;
  }

  public drawCard(card: Card = null, uncover: boolean): Card {

    if (card == null) {

      if (this.cards.length === 0) {
        throw new Error("Stack " + name + " is empty!");
      }

      card = this.cards.pop();
    }

    this.cards = Collections.remove(this.cards, card);

    card.init();
    card.setCovered(!uncover);

    card.object3D.position.copy(this.object3D.position);
    card.object3D.position.x += this.width + 1;
    card.object3D.position.y = this.definition.type === CardType.Pawn ? this.width / 2 + 0.5 : 0.5;

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
