import * as THREE from 'three';

import { Game } from "../Game";
import { GameBoard } from "./GameBoard";
import { Card } from "./Card";
import { CardStack } from "./CardStack";
//import { Character } from "./Character";
import { CardDefinition } from "./CardDefinition";
import { IActor } from "./IActor";
import { CardStackDefinition } from "./CardStackDefinition";

export class World {


  selectedActor: IActor;

  mmBoard: GameBoard;

  cardStacks: CardStack[] = [];

  //characters: Character[] = [];

  constructor(private game: Game) {

    this.mmBoard = new GameBoard("/assets/img/World.png", 100, 1.383238405207486, 1);
    this.game.addActor(this.mmBoard);

    for (var definition of CardStackDefinition.cardStackDefinitions) {

      this.loadCardDefinitions(definition);

      var cardStack = new CardStack(definition, 10, 1.618257261410788, 3);
      cardStack.cleanup(); //set initial coordinates

      this.cardStacks.push(cardStack);
      this.game.addActor(cardStack);
    }

    //let playersCount = 3;

    //for (var i = 0; i < playersCount; i++) {

    //  var card = new Character("/assets/img/Characters/Barbarzynca.png", 10, 0.8053007135575944, 0.5);
    //  this.characters.push(card);

    //  var object = card.object3D;
    //  object.position.x = (playersCount / 2 - i) * 20;
    //  object.position.y = 0.5;
    //  object.position.z = 45;

    //  this.game.addActor(card);
    //}

    //this.newGame();
  }

  public loadCardDefinitions = (stackDefinition: CardStackDefinition) => {
    Game.HttpClient.get(stackDefinition.resourcePath + "/" + stackDefinition.cardDefinitionsUrl).subscribe((res: CardDefinition[]) => {
      stackDefinition.cardDefinitions = res;
      if (this.ensureLoaded()) {
        this.newGame();
      }
    });
  }

  //TODO nicefy
  private ensureLoaded = () : boolean => {
    for (var stack of this.cardStacks) {
      if (!stack.definition.cardDefinitions) {
        return false;
      }
    }
    return true;
  }

  newGame = () => {
    this.cleanup();
    for (var stack of this.cardStacks) {
      stack.buildStack();
    }
  }

  cleanup = () => {

    this.clearSelectedActor();

    for (var stack of this.cardStacks) {
      for (var card of stack.drawnCards) {
        this.disposeCardInternal(card);
      }
      stack.cleanup();
    }
  }

  drawCard = () => {
    let stack = <CardStack>this.selectedActor;
    let card = stack.drawCard();
    this.addNewCard(card);
  }

  addNewCard(card: Card) {
    this.game.addActor(card);
  }

  disposeCard = () => {
    let card = <Card>this.selectedActor;
    this.clearSelectedActor();
    this.disposeCardInternal(card);
  }

  selectActor(actor: IActor) {
    this.clearSelectedActor();
    this.selectedActor = actor;
    this.selectedActor.isSelected = true;
  }

  clearSelectedActor = () => {
    if (this.selectedActor) {
      this.selectedActor.isSelected = false;
    }
    this.selectedActor = null;
  }

  private disposeCardInternal = (card: Card) => {
    card.dispose();
    this.game.removeActor(card);
  }

}
