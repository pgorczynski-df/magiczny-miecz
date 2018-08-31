import { IServerEventHandler } from "@App/common/events/IServerEventHandler";
import { EventHandlerContext } from "@App/common/events/EventHandlerContext";
import { EventKind } from "@App/common/events/EventKind";

export abstract class ServerEventHandlerBase implements IServerEventHandler {

    abstract getEventType(): string;

    abstract process(context: EventHandlerContext, data: any);

    protected respondCaller(context: EventHandlerContext, data: any) {

        context.responseProcessor.respondCaller(
            {
                gameId: context.game.id,
                eventType: this.getEventType(),
                eventKind: EventKind.Notification,
                sourcePlayerId: context.event.sourcePlayerId,
                data: data,
            });
    }

    protected notifyAll(context: EventHandlerContext, data: any) {

        context.responseProcessor.respondAll(
            {
                gameId: context.game.id,
                eventType: this.getEventType(),
                eventKind: EventKind.Notification,
                sourcePlayerId: context.event.sourcePlayerId,
                data: data,
            });
    }

}
