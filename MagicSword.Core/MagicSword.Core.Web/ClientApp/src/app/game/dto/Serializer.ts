import {CardDto} from "./CardDto";
import {Card} from "../logic/Card";
import {Game} from "../Game";
import {GameDto} from "./GameDto";
import {World} from "../logic/World";
import {WorldDto} from "./WorldDto";
import {CardStack} from "../logic/CardStack";
import {CardStackDto} from "./CardStackDto";
import {Object3dDto} from "./Object3dDto";

export class Serializer {

  serializeGame = (game: Game): GameDto => {
    var dto = new GameDto();
    dto.camera = this.serializeObject3D(game.camera);
    dto.world = this.serializeWorld(game.world);
    return dto;
  }

  deserializeGame = (source: GameDto, target: Game): void => {
    this.deserializeObject3D(source.camera, target.camera);
    this.deserializeWorld(source.world, target.world);
  }

  serializeWorld = (world: World): WorldDto => {
    var dto = new WorldDto();
    for (var cardStack of world.cardStacks) {
      var cardStackDto = this.serializeCardStack(cardStack);
      dto.cardStacks.push(cardStackDto);
    }
    //for (var card of world.drawnCards) {
    //  var cardDto = this.serializeCard(card);
    //  dto.drawnCards.push(cardDto);
    //}
    return dto;
  }

  deserializeWorld = (source: WorldDto, target: World): void => {
  }

  serializeCardStack = (cardStack: CardStack): CardStackDto => {
    var dto = new CardStackDto();
    dto.definitionId = cardStack.definition.id;
    dto.object3D = this.serializeObject3D(cardStack.object3D);

    for (var card of cardStack.cards) {
      var cardDto = this.serializeCard(card);
      dto.cards.push(cardDto);
    }

    for (var card2 of cardStack.drawnCards) {
      var cardDto2 = this.serializeCard(card2);
      dto.drawnCards.push(cardDto2);
    }

    for (var card3 of cardStack.disposedCards) {
      var cardDto3 = this.serializeCard(card3);
      dto.disposedCards.push(cardDto3);
    }

    return dto;
  }

  deserializeCardStack = (source: CardStackDto, target: CardStack): void => {
    //TODO

  }

  serializeCard = (card: Card): CardDto => {
    var dto = new CardDto();
    dto.definitionId = card.definition.id;
    dto.loaded = card.loaded;
    if (card.loaded) {
      dto.object3D = this.serializeObject3D(card.object3D);
    } else {
      dto.object3D = null;
    }
    return dto;
  }

  deserializeCard = (source: CardDto, target: Card): void => {
    //TODO

    if (source.loaded) {
      this.deserializeObject3D(source.object3D, target.object3D);
    }

  }

  serializeObject3D = (object3D: THREE.Object3D): Object3dDto => {
    var dto = new Object3dDto();
    dto.position.copy(object3D.position);
    dto.rotation.copy(object3D.rotation);
    return dto;
  }

  deserializeObject3D = (source: Object3dDto, object3D: THREE.Object3D) => {
    object3D.position.copy(source.position);
    object3D.rotation.copy(source.rotation);
  }

}
