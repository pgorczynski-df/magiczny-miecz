import { Event } from "@App/common/events/Event";
import { IResponseProcessor } from "@App/common/events/IResponseProcessor";
import { Services } from "@App/Services";
import { Game } from "@App/common/mechanics/Game";
import { GameProvider } from "@App/GameProvider";
import { IServerEventHandler } from "@App/common/events/IServerEventHandler";
import { JoinGameServerEventHandler } from "@App/common/events/joingame/JoinGameServerEventHandler";
import { DrawCardServerEventHandler } from "@App/common/events/drawcard/DrawCardServerEventHandler";
import { EventHandlerContext } from "@App/common/events/EventHandlerContext";

export class GameEventProcessor {

    private eventHandlers: { [eventType: string]: IServerEventHandler; } = {};

    constructor(private services: Services, private responseProcessor: IResponseProcessor, private gameProvider: GameProvider) {
        this.register(new JoinGameServerEventHandler());
        this.register(new DrawCardServerEventHandler());
    }

    processRequest(game: Game, event: Event) {

        var type = event.eventType;

        var split = type.split("_");
        if (split.length > 1) {
            type = split[0];
        }

        var context = new EventHandlerContext();
        context.game = game;
        context.responseProcessor = this.responseProcessor;
        context.services = this.services;
        context.gameProvider = this.gameProvider;

        var handler = this.eventHandlers[type];
        if (!handler) {
            this.responseProcessor.respondError("Unknown event type: " + event.eventType);
            return;
        }

        handler.process(context, event);
    }

    private register(handler: IServerEventHandler) {
        this.eventHandlers[handler.getEventType()] = handler;
    }
}