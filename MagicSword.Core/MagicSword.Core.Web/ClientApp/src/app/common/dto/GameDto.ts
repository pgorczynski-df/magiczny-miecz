import { Event } from "@App/common/events/Event";
import { WorldDto } from "@App/common/dto/WorldDto";
import { PlayerDto } from "@App/common/dto/PlayerDto";

export class GameDto {

    world: WorldDto;

    players: PlayerDto[] = [];

    outBoundEvents: Event[] = [];

}
