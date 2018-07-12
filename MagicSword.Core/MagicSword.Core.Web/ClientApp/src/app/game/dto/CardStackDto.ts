import * as THREE from 'three';
import {CardDto} from "./CardDto";
import {Object3DDto as Object3dDto} from "./Object3DDto";

export class CardStackDto {

  definitionId: number;

  object3D = new Object3dDto();

  cards: CardDto[] = [];

  drawnCards: CardDto[] = [];

  disposedCards: CardDto[] = [];

}
