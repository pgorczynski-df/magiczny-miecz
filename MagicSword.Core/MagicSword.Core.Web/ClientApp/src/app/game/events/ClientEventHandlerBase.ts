import { Event } from "@App/common/events/Event";
import { ClientEventHandlerContext } from "@App/game/events/ClientEventHandlerContext";
import { IClientEventHandler } from "@App/game/events/IClientEventHandler";

export abstract class ClientEventHandlerBase implements IClientEventHandler {

    context: ClientEventHandlerContext;

    abstract getEventType(): string;

    abstract process(event: Event);

    publishEvent(eventType: string, data: any = null) {
        this.context.services.outboundBus.publish(this.context.game.id, eventType, data);
    }
}
