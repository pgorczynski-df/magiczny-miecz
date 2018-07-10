import * as THREE from 'three';

import { Game } from "../Game";


import { GameBoard } from "./GameBoard";
import {Card} from "./Card";
import {BoxObject} from "../BoxObject";
import {CardStack} from "./CardStack";
import {Character} from "./Character";
import {CardDefinition} from "./CardDefinition";
import {HttpClient} from "@angular/common/http/src/client";
import {IActor} from "./IActor";

export class World {

  selectedActor: IActor;

  mmBoard: GameBoard;

  eventCardStack: CardStack;

  characters: Character[] = [];

  constructor(private game: Game, private httpClient: HttpClient) {

    this.mmBoard = new GameBoard("/assets/img/World.png", 100, 1.383238405207486, 1);
    this.mmBoard.register(game.scene);

    this.eventCardStack = new CardStack("/assets/img/ZdarzenieRewers.png", 10, 1.618257261410788, 3);
    this.eventCardStack.object3D.position.x = -5;
    this.eventCardStack.object3D.position.y = 2;
    this.eventCardStack.name = "Stos kart Zdarzeń";

    this.eventCardStack.register(game.scene);
    game.actors.push(this.eventCardStack.mesh);

    let playersCount = 3;

    for (var i = 0; i < playersCount; i++) {

      var card = new Character("/assets/img/Characters/Barbarzynca.png", 10, 0.8053007135575944, 0.5);
      this.characters.push(card);
      card.register(game.scene);

      var object = card.object3D;
      object.position.x =  (playersCount / 2 - i) * 20;
      object.position.y = 0.5; 
      object.position.z = 45;

      game.actors.push(card.mesh);
      //this.actors.push(card.boxMesh);
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
    object.position.x = stack.object3D.position.x + stack.height + 1;
    object.position.y = 0.5; 

    card.register(this.game.scene);
    this.game.actors.push(card.mesh);
  }
}
