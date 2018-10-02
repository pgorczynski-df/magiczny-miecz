import { Event } from "@Common/events/Event";
import { WorldDto } from "@Common/dto/WorldDto";
import { PlayerDto } from "@Common/dto/PlayerDto";

export class GameDto {

    world: WorldDto;

    players: PlayerDto[] = [];

    outBoundEvents: Event[] = [];

}
