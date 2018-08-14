import * as THREE from "three";
import {CardDto} from "./CardDto";
import { ActorDto } from "./ActorDto";

export class CardStackDto extends ActorDto {

  definitionId: number;

  cards: CardDto[] = [];

  drawnCards: CardDto[] = [];

  disposedCards: CardDto[] = [];

}
