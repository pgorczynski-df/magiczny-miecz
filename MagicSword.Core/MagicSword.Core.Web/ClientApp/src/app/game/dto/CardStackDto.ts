import * as THREE from 'three';
import {CardDto} from "./CardDto";
import {Object3dDto} from "./Object3dDto";

export class CardStackDto {

  definitionId: number;

  object3D = new Object3dDto();

  cards: CardDto[] = [];

  drawnCards: CardDto[] = [];

  disposedCards: CardDto[] = [];

}
