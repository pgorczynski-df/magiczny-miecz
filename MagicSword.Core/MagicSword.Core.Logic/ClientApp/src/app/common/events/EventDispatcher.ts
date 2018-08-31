import { Event } from "@App/common/events/Event";
import { EventKind } from "@App/common/events/EventKind";
import { IResponseProcessor } from "@App/common/events/IResponseProcessor";
import { Services } from "@App/Services";
import { Game } from "@App/common/mechanics/Game";
import { GameProvider } from "@App/common/repository/GameProvider";
import { IServerEventHandler } from "@App/common/events/IServerEventHandler";
import { EventHandlerContext } from "@App/common/events/EventHandlerContext";
import { JoinGameServerEventHandler } from "@App/common/events/joingame/JoinGameServerEventHandler";
import { DrawCardServerEventHandler } from "@App/common/events/drawcard/DrawCardServerEventHandler";
import { ActorMoveServerEventHandler } from "@App/common/events/actormove/ActorMoveServerEventHandler";
import { ActorRotateServerEventHandler } from "@App/common/events/actorrotate/ActorMoveServerEventHandler";

export class EventDispatcher {

    private eventHandlers: { [eventType: string]: IServerEventHandler; } = {};

    constructor(private gameProvider: GameProvider) {
        this.register(new JoinGameServerEventHandler());
        this.register(new DrawCardServerEventHandler());
        this.register(new ActorMoveServerEventHandler());
        this.register(new ActorRotateServerEventHandler());
    }

    process(services: Services, responseProcessor: IResponseProcessor, event: Event) {

        services.logger.debug("EventDispatcher: processing event");
        services.logger.debug(event);

        var type = event.eventType;

        var handler = this.eventHandlers[type];
        if (!handler) {
            responseProcessor.respondError("Unknown request event type: " + event.eventType);
            return;
        }

        if (event.eventKind !== EventKind.Request) {
            services.logger.warn("Unexpected event kind: " + event.eventKind);
        }

        var gameId = event.gameId;
        this.gameProvider.getOrLoadGame(services, gameId, event.sourcePlayerId).then(game => {

            var context = new EventHandlerContext();
            context.game = game;
            context.responseProcessor = responseProcessor;
            context.services = services;
            context.gameProvider = this.gameProvider;
            context.event = event;

            handler.process(context, event.data);
        });

    }

    private register(handler: IServerEventHandler) {
        this.eventHandlers[handler.getEventType()] = handler;
    }
}