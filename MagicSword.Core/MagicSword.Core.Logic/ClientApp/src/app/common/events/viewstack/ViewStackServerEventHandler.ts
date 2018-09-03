import { EventType } from "@App/common/events/EventType";
import { ViewStackRequestDto } from "@App/common/events/viewstack/ViewStackRequestDto";
import { EventHandlerContext } from "@App/common/events/EventHandlerContext";
import { ServerEventHandlerBase } from "@App/common/events/ServerEventHandlerBase";
import { CardStack } from "@App/common/mechanics/CardStack";

export class ViewStackServerEventHandler extends ServerEventHandlerBase {

    getEventType(): string {
        return EventType.ViewStack;
    }

    process(context: EventHandlerContext, data: any) {

        var req = data as ViewStackRequestDto;
        var stack = context.game.findActor(req.stackId) as CardStack;
        var stackDto = context.serializer.serializeCardStack(stack, true, false, false);

        this.respondCaller(context, stackDto);
        this.notifyAll(context, req);
    }

}
