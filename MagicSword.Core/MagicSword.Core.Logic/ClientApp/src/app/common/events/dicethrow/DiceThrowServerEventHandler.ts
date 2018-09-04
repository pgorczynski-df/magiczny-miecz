import { EventType } from "@App/common/events/EventType";
import { EventHandlerContext } from "@App/common/events/EventHandlerContext";
import { ServerEventHandlerBase } from "@App/common/events/ServerEventHandlerBase";

export class DiceThrowServerEventHandler extends ServerEventHandlerBase {

    getEventType(): string {
        return EventType.DiceThrow;
    }

    process(context: EventHandlerContext, data: any) {
        var value = this.getRndInteger(1, 6);
        this.notifyAll(context, value);
    }

    private getRndInteger(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}
