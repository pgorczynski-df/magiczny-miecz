import * as THREE from 'three';
import {CardDto} from "./CardDto";

export class CardStackDto {

  definitionId: number;

  cards: CardDto[] = [];

  drawnCards: CardDto[] = [];

  disposedCards: CardDto[] = [];

}
