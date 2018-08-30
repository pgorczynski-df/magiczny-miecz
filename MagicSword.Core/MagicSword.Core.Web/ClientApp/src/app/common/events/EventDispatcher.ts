import { Event } from "@App/common/events/Event";
import { IResponseProcessor } from "@App/common/events/IResponseProcessor";
import { Services } from "@App/Services";
import { Game } from "@App/common/mechanics/Game";
import { GameProvider } from "@App/common/repository/GameProvider";
import { IServerEventHandler } from "@App/common/events/IServerEventHandler";
import { JoinGameServerEventHandler } from "@App/common/events/joingame/JoinGameServerEventHandler";
import { DrawCardServerEventHandler } from "@App/common/events/drawcard/DrawCardServerEventHandler";
import { EventHandlerContext } from "@App/common/events/EventHandlerContext";

export class EventDispatcher {

    private eventHandlers: { [eventType: string]: IServerEventHandler; } = {};

    constructor(private gameProvider: GameProvider) {
        this.register(new JoinGameServerEventHandler());
        this.register(new DrawCardServerEventHandler());
    }

    process(services: Services, responseProcessor: IResponseProcessor, event: Event) {

        services.logger.debug("EventDispatcher: processing event");
        services.logger.debug(event);

        var type = event.eventType;

        var split = type.split("_");
        if (split.length > 1) {
            type = split[0];
        }

        var handler = this.eventHandlers[type];
        if (!handler) {
            responseProcessor.respondError("Unknown event type: " + event.eventType);
            return;
        }

        var gameId = event.gameId;
        this.gameProvider.getOrLoadGame(services, gameId, event.sourcePlayerId).then(game => {

            var context = new EventHandlerContext();
            context.game = game;
            context.responseProcessor = responseProcessor;
            context.services = services;
            context.gameProvider = this.gameProvider;

            handler.process(context, event);
        });

    }

    private register(handler: IServerEventHandler) {
        this.eventHandlers[handler.getEventType()] = handler;
    }
}