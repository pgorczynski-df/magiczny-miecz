import {CardDto} from "./CardDto";
import {Card} from "../logic/Card";
import {Game} from "../Game";
import {GameDto} from "./GameDto";
import {World} from "../logic/World";
import {WorldDto} from "./WorldDto";
import {CardStack} from "../logic/CardStack";
import {CardStackDto} from "./CardStackDto";
import {Object3DDto as Object3dDto} from "./Object3DDto";

export class Serializer {

  serializeGame = (game: Game): GameDto => {
    var dto = new GameDto();
    dto.camera = this.serializeObject3D(game.camera);
    dto.world = this.serializeWorld(game.world);
    return dto;
  }

  deserializeGame = (source: GameDto, target: Game): void => {

    target.world.cleanup();

    this.deserializeObject3D(source.camera, target.camera);
    this.deserializeWorld(source.world, target.world);
  }

  serializeWorld = (world: World): WorldDto => {
    var dto = new WorldDto();
    for (var cardStack of world.cardStacks) {
      var cardStackDto = this.serializeCardStack(cardStack);
      dto.cardStacks.push(cardStackDto);
    }
    return dto;
  }

  deserializeWorld = (source: WorldDto, target: World): void => {
    for (var cardStack of target.cardStacks) {

      var stackDto = source.cardStacks.find(s => s.definitionId === cardStack.definition.id);
      if (stackDto) {
        this.deserializeCardStack(target, stackDto, cardStack);
      }

    }
  }

  serializeCardStack = (cardStack: CardStack): CardStackDto => {
    var dto = new CardStackDto();
    dto.definitionId = cardStack.definition.id;
    dto.object3D = this.serializeObject3D(cardStack.object3D);

    this.serializeCardCollection(cardStack.cards, dto.cards);
    this.serializeCardCollection(cardStack.drawnCards, dto.drawnCards);
    this.serializeCardCollection(cardStack.disposedCards, dto.disposedCards);

    return dto;
  }

  private serializeCardCollection = (sourceCollection: Card[], targetCollection: CardDto[]) => {
    for (var card of sourceCollection) {
      var cardDto = this.serializeCard(card);
      targetCollection.push(cardDto);
    }
  }

  deserializeCardStack = (world: World, source: CardStackDto, target: CardStack): void => {
    this.deserializeObject3D(source.object3D, target.object3D);

    this.deserializeCardCollection(world, target, source.cards, target.cards);
    this.deserializeCardCollection(world, target, source.drawnCards, target.drawnCards);
    this.deserializeCardCollection(world, target, source.disposedCards, target.disposedCards);
  }

  private deserializeCardCollection = (world: World, stack: CardStack, sourceCollection: CardDto[], targetCollection: Card[]) => {
    for (var cardDto of sourceCollection) {
      var card = this.deserializeCard(world, stack, cardDto);
      targetCollection.push(card);
    }
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

  deserializeCard = (world: World, stack: CardStack, cardDto: CardDto): Card => {
    var card = stack.createCard(cardDto.definitionId, !cardDto.loaded);
    if (cardDto.loaded) {
      world.addNewCard(card);
      this.deserializeObject3D(cardDto.object3D, card.object3D);
    }
    return card;
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