import { Event } from "@App/common/events/Event";
import { EventKind } from "@App/common/events/EventKind";
import { IResponseProcessor } from "@App/common/events/IResponseProcessor";
import { Services } from "@App/Services";
import { GameProvider } from "@App/common/repository/GameProvider";
import { CommonSerializer } from "@App/common/mechanics/CommonSerializer";
import { IServerEventHandler } from "@App/common/events/IServerEventHandler";
import { EventHandlerContext } from "@App/common/events/EventHandlerContext";
import { JoinGameServerEventHandler } from "@App/common/events/joingame/JoinGameServerEventHandler";
import { DrawCardServerEventHandler } from "@App/common/events/drawcard/DrawCardServerEventHandler";
import { ActorMoveServerEventHandler } from "@App/common/events/actormove/ActorMoveServerEventHandler";
import { ActorRotateServerEventHandler } from "@App/common/events/actorrotate/ActorRotateServerEventHandler";
import { ViewStackServerEventHandler } from "@App/common/events/viewstack/ViewStackServerEventHandler";
import { PickCardServerEventHandler } from "@App/common/events/pickcard/PickCardServerEventHandler";
import { DisposeCardServerEventHandler } from "@App/common/events/disposecard/DisposeCardServerEventHandler";

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

            var callingPlayer = game.findPlayer(event.sourcePlayerId);
            if (!callingPlayer) {
                //TODO name
                callingPlayer = game.addPlayer(event.sourcePlayerId, event.sourcePlayerId);
            }

            callingPlayer.incomingEvents.push(event);

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

    private register(handler: IServerEventHandler) {
        this.eventHandlers[handler.getEventType()] = handler;
    }
}
