import { EventType } from "@App/common/events/EventType";
import { StackPushDisposedCardsRequestDto } from "@App/common/events/stackpushdisposedcards/StackPushDisposedCardsRequestDto";
import { EventHandlerContext } from "@App/common/events/EventHandlerContext";
import { ServerEventHandlerBase } from "@App/common/events/ServerEventHandlerBase";
import { CardStack } from "@App/common/mechanics/CardStack";

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
