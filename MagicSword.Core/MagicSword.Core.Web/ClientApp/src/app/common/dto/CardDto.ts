import { ActorDto } from "@App/common/dto/ActorDto";

export class CardDto extends ActorDto {

  definitionId: number;

  originStackDefinitionId: number;

  //loaded: boolean;

  isCovered: boolean;

}
