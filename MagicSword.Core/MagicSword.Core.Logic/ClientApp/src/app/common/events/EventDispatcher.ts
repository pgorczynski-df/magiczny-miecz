import { Event } from "@Common/events/Event";
import { EventKind } from "@Common/events/EventKind";
import { IResponseProcessor } from "@Common/events/IResponseProcessor";
import { Services } from "@Common/infrastructure/Services";
import { UserDto } from "@Common/client/UserDto";
import { Game } from "@Common/mechanics/Game";
import { Player } from "@Common/mechanics/Player";
import { GameProvider } from "@Common/repository/GameProvider";
import { CommonSerializer } from "@Common/mechanics/CommonSerializer";
import { IServerEventHandler } from "@Common/events/IServerEventHandler";
import { EventHandlerContext } from "@Common/events/EventHandlerContext";
import { JoinGameServerEventHandler } from "@Common/events/joingame/JoinGameServerEventHandler";
import { DrawCardServerEventHandler } from "@Common/events/drawcard/DrawCardServerEventHandler";
import { ActorMoveServerEventHandler } from "@Common/events/actormove/ActorMoveServerEventHandler";
import { ActorRotateServerEventHandler } from "@Common/events/actorrotate/ActorRotateServerEventHandler";
import { ViewStackServerEventHandler } from "@Common/events/viewstack/ViewStackServerEventHandler";
import { PickCardServerEventHandler } from "@Common/events/pickcard/PickCardServerEventHandler";
import { DisposeCardServerEventHandler } from "@Common/events/disposecard/DisposeCardServerEventHandler";
import { CameraChangeEventHandler } from "@Common/events/camerachange/CameraChangeEventHandler";
import { DiceThrowServerEventHandler } from "@Common/events/dicethrow/DiceThrowServerEventHandler";
import { CardSetAttributeServerEventHandler } from "@Common/events/cardsetattribute/CardSetAttributeServerEventHandler";
import { PlayerMessageServerEventHandler } from "@Common/events/playermessage/PlayerMessageServerEventHandler";
import { StackShuffleServerEventHandler } from "@Common/events/stackshuffle/StackShuffleServerEventHandler";
import { StackPushDisposedCardsServerEventHandler } from "@Common/events/stackpushdisposedcards/StackPushDisposedCardsServerEventHandler";

export class EventDispatcher {

    private eventHandlers: { [eventType: string]: IServerEventHandler; } = {};

    constructor(private gameProvider: GameProvider, private commonSerializer: CommonSerializer) {
        this.register(new JoinGameServerEventHandler());
        this.register(new DrawCardServerEventHandler());
        this.register(new ActorMoveServerEventHandler());
        this.register(new ActorRotateServerEventHandler());
        this.register(new ViewStackServerEventHandler());
        this.register(new PickCardServerEventHandler());
        this.register(new DisposeCardServerEventHandler());
        this.register(new CameraChangeEventHandler());
        this.register(new DiceThrowServerEventHandler());
        this.register(new CardSetAttributeServerEventHandler());
        this.register(new PlayerMessageServerEventHandler());
        this.register(new StackShuffleServerEventHandler());
        this.register(new StackPushDisposedCardsServerEventHandler());
    }

    process(services: Services, responseProcessor: IResponseProcessor, event: Event, sourceUser: UserDto) {

        services.logger.debug("EventDispatcher: processing event");
        services.logger.debug(event);

        var type = event.eventType;

        var handler = this.eventHandlers[type];
        if (!handler) {
            responseProcessor.respondError({
                code: 400,
                reason: "Unknown request event type: " + event.eventType
            });
            return;
        }

        if (event.eventKind !== EventKind.Request) {
            services.logger.warn("Unexpected event kind: " + event.eventKind);
        }

        var gameId = event.gameId;
        var sourceUserId = sourceUser.id;
        this.gameProvider.getOrLoadGame(services, gameId).then(game => {

            this.ensureGameInitialized(services, game, sourceUser);

            //TODO check if game is open (?)

            var callingPlayer = game.findPlayer(sourceUserId);
            if (!callingPlayer) {
                callingPlayer = game.addPlayer(sourceUserId, sourceUser.nickname);
            }

            if (!handler.isTransient()) {
                callingPlayer.incomingEvents.push(event);
            }

            var context = new EventHandlerContext();
            context.game = game;
            context.responseProcessor = responseProcessor;
            context.services = services;
            context.gameProvider = this.gameProvider;
            context.event = event;
            context.serializer = this.commonSerializer;
            context.callingPlayer = callingPlayer;

            handler.process(context, event.data);

            this.gameProvider.persistGame(services, game);
        });

    }

    private ensureGameInitialized(services: Services, game: Game, sourceUser: UserDto): void {
        if (!game.owner) {
            var p = new Player();
            p.id = sourceUser.id;
            p.name = sourceUser.nickname;
            game.owner = p;
            game.players.push(p);
            services.logger.debug(`Setting owner of gameId = ${game.id} to ownerId = ${game.owner.id}`);
        }
    }

    private register(handler: IServerEventHandler) {
        this.eventHandlers[handler.getEventType()] = handler;
    }
}
