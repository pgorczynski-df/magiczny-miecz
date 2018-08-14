import { WorldDto } from "app/game/dto/WorldDto";
import { Object3DDto } from "app/game/dto/Object3DDto";
import { PlayerDto } from "app/game/dto/PlayerDto";

export class GameDto {

  camera = new Object3DDto();

  world: WorldDto;

  players: PlayerDto[] = [];

}
