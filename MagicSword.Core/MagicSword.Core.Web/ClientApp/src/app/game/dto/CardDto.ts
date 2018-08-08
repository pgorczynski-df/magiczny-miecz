import { ActorDto } from "./ActorDto";

export class CardDto extends ActorDto {

  definitionId: number;

  originStackDefinitionId: number;

  loaded: boolean;

  isCovered: boolean;

}
