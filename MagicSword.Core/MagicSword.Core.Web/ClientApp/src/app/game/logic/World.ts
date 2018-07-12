import * as THREE from 'three';

import { Game } from "../Game";
import { GameBoard } from "./GameBoard";
import { Card } from "./Card";
import { CardStack } from "./CardStack";
import { Character } from "./Character";
import { CardDefinition } from "./CardDefinition";
import { HttpClient } from "@angular/common/http";
import { IActor } from "./IActor";
import { CardStackDefinition } from "./CardStackDefinition";

export class World {

  cardStackDefinitions: CardStackDefinition[] = [
    <CardStackDefinition>{
      id: 1,
      name: "Stos kart Zdarzeń",
      type: "Zdarzenie",
      resourcePath: "/assets/img/Zdarzenia",
      imageUrl: "ZdarzenieRewers.png",
      cardDefinitionsUrl: "Zdarzenia.json",
    }
  ];

  selectedActor: IActor;

  mmBoard: GameBoard;

  cardStacks: CardStack[] = [];

  characters: Character[] = [];

  //drawnCards: Card[] = [];

  constructor(private game: Game, private httpClient: HttpClient) {

    this.mmBoard = new GameBoard("/assets/img/World.png", 100, 1.383238405207486, 1);
    this.game.addActor(this.mmBoard);

    for (var j = 0; j < this.cardStackDefinitions.length; j++) {
      var definition = this.cardStackDefinitions[j];
      this.loadCardDefinitions(definition);

      var cardStack = new CardStack(definition, 10, 1.618257261410788, 3);

      this.cardStacks.push(cardStack);
      this.game.addActor(cardStack);

      cardStack.object3D.position.x = -5;
      cardStack.object3D.position.y = 2;
      cardStack.object3D.position.z = 0;
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
      this.newGame();
    });
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

      stack.object3D.position.x = -5;
      stack.object3D.position.y = 2;
      stack.object3D.position.z = 0;

      stack.object3D.rotation.set(0, 0, 0);
    }
  }

  drawCard = () => {
    let stack = <CardStack>this.selectedActor;
    let card = stack.drawCard();

    var object = card.object3D;
    object.position.x = stack.object3D.position.x + stack.width + 1;
    object.position.y = 0.5;

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
