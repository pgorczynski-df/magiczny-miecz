import { EventType } from "@Common/events/EventType";
import { EventHandlerContext } from "@Common/events/EventHandlerContext";
import { ServerEventHandlerBase } from "@Common/events/ServerEventHandlerBase";

export class PlayerMessageServerEventHandler extends ServerEventHandlerBase {

    static readonly maxLength = 400;

    getEventType(): string {
        return EventType.PlayerMessage;
    }

    process(context: EventHandlerContext, data: any) {
        var value = data as string;

        if (!value || value.length === 0) {
            return;
        }

        value = value.substr(0, PlayerMessageServerEventHandler.maxLength);

        this.notifyAll(context, value);
    }

}
