import * as THREE from "three";
import { CardDto } from "@Common/dto/CardDto";
import { ActorDto } from "@Common/dto/ActorDto";

export class CardStackDto extends ActorDto {

  definitionId: number;

  cards: CardDto[] = [];

  drawnCards: CardDto[] = [];

  disposedCards: CardDto[] = [];

}
