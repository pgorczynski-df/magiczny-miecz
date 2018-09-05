import { CardDto } from "@App/common/dto/CardDto";
import { Card } from "@App/game/logic/Card";
import { Game } from "@App/game/Game";
import { GameDto } from "@App/common/dto/GameDto";
import { World } from "@App/game/logic/World";
import { WorldDto } from "@App/common/dto/WorldDto";
import { CardStack } from "@App/game/logic/CardStack";
import { CardStackDto } from "@App/common/dto/CardStackDto";
import { Object3DDto as Object3dDto } from "@App/common/dto/Object3DDto";
import { IActor } from "@App/game/logic/IActor";
import { ActorDto } from "@App/common/dto/ActorDto";
import { CommonSerializer } from "@App/common/mechanics/CommonSerializer";

export class ClientSerializer {

    private commonSerializer = new CommonSerializer();

    serializeGame = (game: Game): GameDto => {
        var dto = new GameDto();

        dto.world = this.serializeWorld(game.world);
        for (var player of game.players) {
            var playerDto = this.commonSerializer.serializePlayer(player);
            dto.players.push(playerDto);
        }
        return dto;
    }

    deserializeGame = (source: GameDto, target: Game): void => {

        target.world.cleanup();
        target.players = [];

        for (var dto of source.players) {
            var player = this.commonSerializer.deserializePlayer(dto);
            target.players.push(player);
        }

        var currentPlayer = target.getCurrentPlayer();
        if (currentPlayer && currentPlayer.camera) {
            this.deserializeObject3D(currentPlayer.camera, target.camera); //TODO type mismatch - to be fixed
        }

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
        dto.id = cardStack.id;
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
        target.id = source.id;

        this.deserializeObject3D(source.object3D, target.object3D);

        this.deserializeCardCollection(world, target, source.cards, target.cards, false);
        this.deserializeCardCollection(world, target, source.drawnCards, target.drawnCards, true);
        this.deserializeCardCollection(world, target, source.disposedCards, target.disposedCards, false);
    }

    public deserializeCardCollection = (world: World, stack: CardStack, sourceCollection: CardDto[], targetCollection: Card[], loadCard: boolean) => {
        for (var cardDto of sourceCollection) {
            var card = this.deserializeCard(world, stack, cardDto, loadCard);
            targetCollection.push(card);
        }
    }

    serializeCard = (card: Card): CardDto => {
        var dto = new CardDto();
        dto.id = card.id;
        dto.definitionId = card.definition.id;
        //dto.loaded = card.loaded;
        dto.isCovered = card.isCovered;
        dto.attributes = card.attributes;
        dto.originStackDefinitionId = card.originStack.definition.id;
        if (card.loaded) {
            dto.object3D = this.serializeObject3D(card.object3D);
        } else {
            dto.object3D = null;
        }
        return dto;
    }

    deserializeCard = (world: World, stack: CardStack, cardDto: CardDto, loadCard: boolean): Card => {
        var card = stack.createCard(cardDto.definitionId, !loadCard);
        card.id = cardDto.id;
        card.isCovered = cardDto.isCovered;
        card.attributes = cardDto.attributes;
        if (loadCard) {
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

    serializeActor = (actor: IActor): ActorDto => {
        var dto = new ActorDto();
        dto.id = actor.id;
        dto.object3D = this.serializeObject3D(actor.object3D);
        return dto;
    }

    deserializeActor = (source: ActorDto, target: IActor) => {
        target.id = source.id;
        this.deserializeObject3D(source.object3D, target.object3D);
    }

}
