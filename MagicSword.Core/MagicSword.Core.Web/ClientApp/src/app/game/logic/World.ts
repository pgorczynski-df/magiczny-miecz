import * as THREE from 'three';

import { Game } from "../Game";
import {GameBoard} from "./GameBoard";
import {Card} from "./Card";
import {BoxObject} from "../BoxObject";
import {CardStack} from "./CardStack";
import {Character} from "./Character";

export class World {

  mmBoard: GameBoard;

  zdarzeniaStos: CardStack;

  characters: Character[] = [];

  constructor(game: Game) {

    this.mmBoard = new GameBoard("/assets/img/World.png", 100, 1.383238405207486, 1);
    this.mmBoard.register(game.scene);

    this.zdarzeniaStos = new CardStack("/assets/img/ZdarzenieRewers.png", 10, 1.618257261410788, 3);
    this.zdarzeniaStos.object3D.position.x = -5;
    this.zdarzeniaStos.object3D.position.y = 2;

    this.zdarzeniaStos.register(game.scene);
    game.actors.push(this.zdarzeniaStos.mesh);

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
  }

}
