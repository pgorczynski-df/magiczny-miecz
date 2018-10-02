import { EventType } from "@Common/events/EventType";
import { StackPushDisposedCardsRequestDto } from "@Common/events/stackpushdisposedcards/StackPushDisposedCardsRequestDto";
import { EventHandlerContext } from "@Common/events/EventHandlerContext";
import { ServerEventHandlerBase } from "@Common/events/ServerEventHandlerBase";
import { CardStack } from "@Common/mechanics/CardStack";

export class StackPushDisposedCardsServerEventHandler extends ServerEventHandlerBase {

    getEventType(): string {
        return EventType.StackPushDisposedCards;
    }

    process(context: EventHandlerContext, data: any) {

        var req = data as StackPushDisposedCardsRequestDto;
        var stack = context.game.findActor(req.stackId) as CardStack;
        stack.pushDisposedCards();

        this.notifyAll(context, req);
    }

}
