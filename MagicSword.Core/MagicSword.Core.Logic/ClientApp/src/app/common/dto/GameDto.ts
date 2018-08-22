import { WorldDto } from "@App/common/dto/WorldDto";
import { Object3DDto } from "@App/common/dto/Object3DDto";
import { PlayerDto } from "@App/common/dto/PlayerDto";

export class GameDto {

  camera = new Object3DDto();

  world: WorldDto;

  players: PlayerDto[] = [];

}
