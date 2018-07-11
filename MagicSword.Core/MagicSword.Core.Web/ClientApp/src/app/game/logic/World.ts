import * as THREE from 'three';

import { Game } from "../Game";


import { GameBoard } from "./GameBoard";
import {Card} from "./Card";
import {BoxObject} from "../BoxObject";
import {CardStack} from "./CardStack";
import {Character} from "./Character";
import {CardDefinition} from "./CardDefinition";
import {HttpClient} from "@angular/common/http";
import {IActor} from "./IActor";
import {Serializer} from "../dto/Serializer";

export class World {

  selectedActor: IActor;

  mmBoard: GameBoard;

  eventCardStack: CardStack;

  characters: Character[] = [];

  constructor(private game: Game, private httpClient: HttpClient) {

    this.mmBoard = new GameBoard("/assets/img/World.png", 100, 1.383238405207486, 1);
    this.game.addActor(this.mmBoard);

    this.eventCardStack = new CardStack("/assets/img/Zdarzenia", "ZdarzenieRewers.png", 10, 1.618257261410788, 3);
    this.eventCardStack.object3D.position.x = -5;
    this.eventCardStack.object3D.position.y = 2;
    this.eventCardStack.name = "Stos kart Zdarzeń";

    this.game.addActor(this.eventCardStack);

    let playersCount = 3;

    for (var i = 0; i < playersCount; i++) {

      var card = new Character("/assets/img/Characters/Barbarzynca.png", 10, 0.8053007135575944, 0.5);
      this.characters.push(card);

      var object = card.object3D;
      object.position.x =  (playersCount / 2 - i) * 20;
      object.position.y = 0.5; 
      object.position.z = 45;

      this.game.addActor(card);
    }

    this.loadDefinitions();
  }

  beginGame = () => {
    this.eventCardStack.buildStack();
  }

  loadDefinitions = () => {
    this.httpClient.get("/assets/definitions/Zdarzenia.json").subscribe((res: CardDefinition[]) => {
      this.eventCardStack.cardDefinitions = res;

      // others ...

      this.beginGame();
    });
  }

  drawCard = () => {
    let stack = <CardStack>this.selectedActor;
    let card = stack.drawCard();

    var object = card.object3D;
    object.position.x = stack.object3D.position.x + stack.width + 1;
    object.position.y = 0.5; 

    this.game.addActor(card);
  }


}
