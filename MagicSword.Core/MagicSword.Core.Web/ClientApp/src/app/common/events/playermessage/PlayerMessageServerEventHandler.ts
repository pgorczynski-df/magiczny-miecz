import { EventType } from "@App/common/events/EventType";
import { EventHandlerContext } from "@App/common/events/EventHandlerContext";
import { ServerEventHandlerBase } from "@App/common/events/ServerEventHandlerBase";

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
