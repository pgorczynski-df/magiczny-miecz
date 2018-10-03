import { Event } from "@Common/events/Event";
import { ClientEventHandlerContext } from "@App/game/events/ClientEventHandlerContext";
import { IClientEventHandler } from "@App/game/events/IClientEventHandler";
import { EventKind } from "@Common/events/EventKind";
import { ResourceManager } from "@App/game/ResourceManager";

export abstract class ClientEventHandlerBase implements IClientEventHandler {

    context: ClientEventHandlerContext;

    abstract getEventType(): string;

    processNotification(event: Event) {
    }

    processResponse(event: Event) {
    }

    protected sendRequest(data: any) {
        this.context.services.outboundBus.publish(this.context.game.id, this.getEventType(), EventKind.Request, data);
    }

    public getMessage(event: Event): string {
        return event.eventType;
    }

    protected senderName(event: Event) {
        var player = this.context.game.findPlayer(event.sourcePlayerId);
        return player.name;
    }

    protected r() {
        return this.res(this.getEventType());
    }

    protected res(key: string) {
        return ResourceManager.getLocalizationMessage(key);
    }
}
