import { CardDto } from "@App/common/dto/CardDto";
import { Card } from "@App/common/mechanics/Card";
import { Game } from "@App/common/mechanics/Game";
import { GameDto } from "@App/common/dto/GameDto";
import { World } from "@App/common/mechanics/World";
import { WorldDto } from "@App/common/dto/WorldDto";
import { CardStack } from "@App/common/mechanics/CardStack";
import { CardStackDto } from "@App/common/dto/CardStackDto";
import { Object3DDto } from "@App/common/dto/Object3DDto";
import { IActorBase } from "@App/common/mechanics/IActorBase";
import { ActorDto } from "@App/common/dto/ActorDto";
import { Player } from "@App/common/mechanics/Player";
import { PlayerDto } from "@App/common/dto/PlayerDto";
import { Object3D } from "@App/common/mechanics/Object3D";

export class CommonSerializer {

    serializeGame = (game: Game): GameDto => {
        var dto = new GameDto();
        dto.outBoundEvents = game.outBoundEvents;
        dto.world = this.serializeWorld(game.world);
        for (var player of game.players) {
            var playerDto = this.serializePlayer(player);
            dto.players.push(playerDto);
        }
        return dto;
    }

    serializeGameForPlayer(game: Game, playerId: string): GameDto {
        var dto = new GameDto();
        dto.outBoundEvents = []; //handled in JoinGameServerEventHandler
        dto.world = this.serializeWorld(game.world, false, true, true);
        for (var player of game.players) {
            var playerDto = this.serializePlayer(player, false);
            dto.players.push(playerDto);
        }
        return dto;
    }

    deserializeGame = (source: GameDto, target: Game): void => {

        target.outBoundEvents = source.outBoundEvents;
        target.world.cleanup();
        target.players = [];

        for (var player of source.players) {
            var playerDto = this.deserializePlayer(player);
            target.players.push(playerDto);
        }

        this.deserializeWorld(source.world, target.world);
    }

    serializePlayer = (player: Player, includeEvents = true): PlayerDto => {
        var dto = {
            id: player.id,
            name: player.name,
            camera: this.serializeObject3D(player.camera),
            incomingEvents: includeEvents ? player.incomingEvents : [],
            outboundEventIds: includeEvents ? player.outboundEventIds : [],
        } as PlayerDto;
        return dto;
    }

    deserializePlayer = (playerDto: PlayerDto): Player => {
        var player = {
            id: playerDto.id,
            name: playerDto.name,
            camera: null,
            incomingEvents: playerDto.incomingEvents,
            outboundEventIds: playerDto.outboundEventIds,
        } as Player;
        if (playerDto.camera) {
            player.camera = new Object3D();
            this.deserializeObject3D(playerDto.camera, player.camera);
        }
        return player;
    }

    serializeWorld = (world: World, serializeCards = true, serializeDrawnCards = true, serializeDisposedCards = true): WorldDto => {
        var dto = new WorldDto();
        for (var cardStack of world.cardStacks) {
            var cardStackDto = this.serializeCardStack(cardStack, serializeCards, serializeDrawnCards, serializeDisposedCards);
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

    serializeCardStack = (cardStack: CardStack, serializeCards = true, serializeDrawnCards = true, serializeDisposedCards = true): CardStackDto => {
        var dto = new CardStackDto();
        dto.id = cardStack.id;
        dto.definitionId = cardStack.definition.id;
        dto.object3D = this.serializeObject3D(cardStack.object3D);

        if (serializeCards) {
            this.serializeCardCollection(cardStack.cards, dto.cards);
        }
        if (serializeDrawnCards) {
            this.serializeCardCollection(cardStack.drawnCards, dto.drawnCards);
        }
        if (serializeDisposedCards) {
            this.serializeCardCollection(cardStack.disposedCards, dto.disposedCards);
        }

        return dto;
    }

    public serializeCardCollection = (sourceCollection: Card[], targetCollection: CardDto[]) => {
        for (var card of sourceCollection) {
            var cardDto = this.serializeCard(card);
            targetCollection.push(cardDto);
        }
    }

    deserializeCardStack = (world: World, source: CardStackDto, target: CardStack): void => {
        target.id = source.id;

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
        dto.id = card.id;
        dto.definitionId = card.definition.id;
        dto.attributes = card.attributes;
        dto.isCovered = card.isCovered;
        dto.originStackDefinitionId = card.originStack.definition.id;
        dto.object3D = this.serializeObject3D(card.object3D);

        return dto;
    }

    deserializeCard = (world: World, stack: CardStack, cardDto: CardDto): Card => {
        var card = stack.createCard(cardDto.definitionId);
        card.id = cardDto.id;
        card.isCovered = cardDto.isCovered;
        if (cardDto.attributes) {
            card.attributes = cardDto.attributes;
        }
        this.deserializeObject3D(cardDto.object3D, card.object3D);
        return card;
    }

    serializeObject3D = (object3D: Object3D): Object3DDto => {
        if (!object3D) {
            return null;
        }
        var dto = new Object3DDto();
        dto.position.copy(object3D.position);
        dto.rotation.copy(object3D.rotation);
        return dto;
    }

    deserializeObject3D = (source: Object3DDto, object3D: Object3D) => {
        if (!source) {
            return;
        }
        object3D.position.copy(source.position);
        object3D.rotation.copy(source.rotation);
    }

    serializeActor = (actor: IActorBase): ActorDto => {
        var dto = new ActorDto();
        dto.id = actor.id;
        dto.object3D = this.serializeObject3D(actor.object3D);
        return dto;
    }

    deserializeActor = (source: ActorDto, target: IActorBase) => {
        target.id = source.id;
        this.deserializeObject3D(source.object3D, target.object3D);
    }

}
