import * as THREE from 'three';

import { Game } from "../Game";
import {GameBoard} from "./GameBoard";
import {Card} from "./Card";
import {BoxObject} from "../BoxObject";

export class World {

  mmBoard: GameBoard;

  constructor(game: Game) {

    this.mmBoard = new GameBoard("/assets/img/World.png", 100, 1.383238405207486, 1);
    this.mmBoard.register(game.scene);

    for (var i = 0; i < 10; i++) {

      var card = new Card("/assets/img/Characters/Barbarzynca.png", 10, 1.241772151898734, 0.5);
      card.register(game.scene);

      var object = card.object3D;
      object.position.x = Math.random() * 50 - 25;
      object.position.y = 0.5; // Math.random() * 50 - 25;
      object.position.z = Math.random() * 50 - 25;

      game.objects.push(card.mesh);
      //this.objects.push(card.boxMesh);
    }
  }

}
