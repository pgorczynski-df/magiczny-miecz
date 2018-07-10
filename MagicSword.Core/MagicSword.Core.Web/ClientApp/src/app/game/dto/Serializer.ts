import {CardDto} from "./CardDto";
import {Card} from "../logic/Card";

export class Serializer {

  serializeCard = (card: Card): CardDto => {
    var dto = new CardDto();
    dto.position.copy(card.mesh.position);
    dto.rotation.copy(card.mesh.rotation);
    return dto;
  }

  deserializeCard = (source: CardDto, target: Card): void => {
    target.mesh.position.copy(source.position);
    target.mesh.rotation.copy(source.rotation);
  }

}
