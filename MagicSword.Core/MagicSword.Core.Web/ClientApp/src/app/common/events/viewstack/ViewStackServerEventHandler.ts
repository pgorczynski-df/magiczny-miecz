import { EventType } from "@App/common/events/EventType";
import { ViewStackRequestDto } from "@App/common/events/viewstack/ViewStackRequestDto";
import { EventHandlerContext } from "@App/common/events/EventHandlerContext";
import { ServerEventHandlerBase } from "@App/common/events/ServerEventHandlerBase";

export class ViewStackServerEventHandler extends ServerEventHandlerBase {

    getEventType(): string {
        return EventType.ViewStack;
    }

    process(context: EventHandlerContext, data: any) {


    }

}
