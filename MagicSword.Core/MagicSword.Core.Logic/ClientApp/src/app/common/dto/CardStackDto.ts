import * as THREE from "three";
import { CardDto } from "@App/common/dto/CardDto";
import { ActorDto } from "@App/common/dto/ActorDto";

export class CardStackDto extends ActorDto {

  definitionId: number;

  cards: CardDto[] = [];

  drawnCards: CardDto[] = [];

  disposedCards: CardDto[] = [];

}
