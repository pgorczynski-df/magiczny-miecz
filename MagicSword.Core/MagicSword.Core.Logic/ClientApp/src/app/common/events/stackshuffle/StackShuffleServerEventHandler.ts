import { EventType } from "@Common/events/EventType";
import { StackShuffleRequestDto } from "@Common/events/stackshuffle/StackShuffleRequestDto";
import { EventHandlerContext } from "@Common/events/EventHandlerContext";
import { ServerEventHandlerBase } from "@Common/events/ServerEventHandlerBase";
import { CardStack } from "@Common/mechanics/CardStack";

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
