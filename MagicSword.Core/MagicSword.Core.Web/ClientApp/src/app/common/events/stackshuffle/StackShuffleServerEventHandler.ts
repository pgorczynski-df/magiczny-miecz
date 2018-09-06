import { EventType } from "@App/common/events/EventType";
import { StackShuffleRequestDto } from "@App/common/events/stackshuffle/StackShuffleRequestDto";
import { EventHandlerContext } from "@App/common/events/EventHandlerContext";
import { ServerEventHandlerBase } from "@App/common/events/ServerEventHandlerBase";
import { CardStack } from "@App/common/mechanics/CardStack";

export class StackShuffleServerEventHandler extends ServerEventHandlerBase {

    getEventType(): string {
        return EventType.StackShuffle;
    }

    process(context: EventHandlerContext, data: any) {

        var req = data as StackShuffleRequestDto;
        var stack = context.game.findActor(req.stackId) as CardStack;
        stack.shuffle();

        this.notifyAll(context, req);
    }

}
