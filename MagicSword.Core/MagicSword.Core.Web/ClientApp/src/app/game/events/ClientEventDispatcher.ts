import { Event } from "@App/common/events/Event";
import { Services } from "@App/Services";
import { IClientEventHandler } from "@App/game/events/IClientEventHandler";
import { ClientEventHandlerContext } from "@App/game/events/ClientEventHandlerContext";
import { Game } from "@App/game/Game";
import { DrawCardClientEventHandler } from "@App/game/events/handlers/DrawCardClientEventHandler";

export class ClientEventDispatcher {

    drawCardHandler = new DrawCardClientEventHandler();

    private eventHandlers: { [eventType: string]: IClientEventHandler; } = {};
    private context = new ClientEventHandlerContext();

    constructor(private services: Services, private game: Game) {
        this.context.game = this.game;
        this.context.services = this.services;

        this.register(this.drawCardHandler);
    }

    process(event: Event) {

        this.services.logger.debug("EventDispatcher: processing event");
        this.services.logger.debug(event);

        var type = event.eventType;

        var split = type.split("_");
        if (split.length > 1) {
            type = split[0];
        }

        var handler = this.eventHandlers[type];
        if (!handler) {
            //responseProcessor.respondError("Unknown event type: " + event.eventType);
            return;
        }

        handler.process(event);
    }

    private register(handler: IClientEventHandler) {
        handler.context = this.context;
        this.eventHandlers[handler.getEventType()] = handler;
    }


}
