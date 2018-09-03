import { IServerEventHandler } from "@App/common/events/IServerEventHandler";
import { EventHandlerContext } from "@App/common/events/EventHandlerContext";
import { Event } from "@App/common/events/Event";
import { EventKind } from "@App/common/events/EventKind";
import { EventType } from "@App/common/events/EventType";
import { Guid } from "@App/common/utils/Guid";

export abstract class ServerEventHandlerBase implements IServerEventHandler {

    abstract getEventType(): string;

    abstract process(context: EventHandlerContext, data: any);

    private createEvent(context: EventHandlerContext, eventType: string, eventKind: string, data: any) : Event {
        var ev = {
            id: Guid.uuidv4(),
            requestEventId: context.event.id,
            gameId: context.game.id,
            eventType: eventType,
            eventKind: eventKind,
            sourcePlayerId: context.callingPlayer.id,
            data: data,
        };
        context.game.outBoundEvents.push(ev);
        return ev;
    }

    protected respondCaller(context: EventHandlerContext, data: any) {
        var ev = this.createEvent(context, this.getEventType(), EventKind.Response, data);
        context.callingPlayer.outboundEventIds.push(ev.id);
        context.responseProcessor.respondCaller(ev);
    }

    protected respondError(context: EventHandlerContext, data: any) {
        var ev = this.createEvent(context, EventType.Error, EventKind.Response, data);
        context.callingPlayer.outboundEventIds.push(ev.id);
        context.services.logger.error(ev);
        context.responseProcessor.respondCaller(ev);
    }

    protected notifyAll(context: EventHandlerContext, data: any) {
        var ev = this.createEvent(context, this.getEventType(), EventKind.Notification, data);
        for (var player of context.game.players) {
            player.outboundEventIds.push(ev.id);
        }
        context.responseProcessor.respondAll(ev);
    }

}
