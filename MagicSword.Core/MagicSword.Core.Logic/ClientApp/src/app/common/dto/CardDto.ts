import { ActorDto } from "@App/common/dto/ActorDto";

export class CardDto extends ActorDto {

    definitionId: number;

    originStackDefinitionId: number;

    isCovered: boolean;

    attributes: { [name: string]: number } = {};

}
