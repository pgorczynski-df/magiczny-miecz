import {CardDto} from "./CardDto";
import {Card} from "../logic/Card";
import {Game} from "../Game";
import {GameDto} from "./GameDto";
import {World} from "../logic/World";
import {WorldDto} from "./WorldDto";

export class Serializer {

  serializeGame = (game: Game): GameDto => {
    var dto = new GameDto();
    dto.cameraPosition.copy(game.camera.position);
    dto.cameraRotation.copy(game.camera.rotation);

    dto.world = this.serializeWorld(game.world);
    return dto;
  }

  deserializeGame = (source: GameDto, target: Game): void => {
    target.camera.position.copy(source.cameraPosition);
    target.camera.rotation.copy(source.cameraRotation);

    this.deserializeWorld(source.world, target.world);
  }

  serializeWorld = (world: World): WorldDto => {
    var dto = new WorldDto();
    return dto;
  }

  deserializeWorld = (source: WorldDto, target: World): void => {
  }

  serializeCard = (card: Card): CardDto => {
    var dto = new CardDto();
    dto.position.copy(card.object3D.position);
    dto.rotation.copy(card.object3D.rotation);
    return dto;
  }

  deserializeCard = (source: CardDto, target: Card): void => {
    target.object3D.position.copy(source.position);
    target.object3D.rotation.copy(source.rotation);
  }

}
