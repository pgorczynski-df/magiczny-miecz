import { ActorDto } from "@Common/dto/ActorDto";

export class CardDto extends ActorDto {

    definitionId: number;

    originStackDefinitionId: number;

    isCovered: boolean;

    attributes: { [name: string]: number } = {};

}
