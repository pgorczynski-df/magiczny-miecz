import { Event } from "@App/common/events/Event";
import { EventKind } from "@App/common/events/EventKind";
import { Services } from "@App/Services";
import { IClientEventHandler } from "@App/game/events/IClientEventHandler";
import { ClientEventHandlerContext } from "@App/game/events/ClientEventHandlerContext";
import { Game } from "@App/game/Game";
import { DrawCardClientEventHandler } from "@App/game/events/handlers/DrawCardClientEventHandler";
import { JoinGameEventHandler } from "@App/game/events/handlers/JoinGameEventHandler";

export class ClientEventDispatcher {

    drawCardHandler = new DrawCardClientEventHandler();
    joinGameHandler = new JoinGameEventHandler();

    private eventHandlers: { [eventType: string]: IClientEventHandler; } = {};
    private context = new ClientEventHandlerContext();

    constructor(private services: Services, private game: Game) {
        this.context.game = this.game;
        this.context.services = this.services;

        this.register(this.drawCardHandler);
        this.register(this.joinGameHandler);
    }

    process(event: Event) {

        var type = event.eventType;

        var handler = this.eventHandlers[type];
        if (!handler) {
            this.services.logger.error("Unknown incoming event type: " + type);
            return;
        }

        switch (event.eventKind) {
            case EventKind.Response:
                handler.processResponse(event);
                break;
            case EventKind.Notification:
                handler.processNotification(event);
                break;
            default:
                this.services.logger.error("Unexpected incoming event kind: " + event.eventKind);
                break;
        }

    }

    private register(handler: IClientEventHandler) {
        handler.context = this.context;
        this.eventHandlers[handler.getEventType()] = handler;
    }


}
