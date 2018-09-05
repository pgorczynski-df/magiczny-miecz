import { EventType } from "@App/common/events/EventType";
import { ViewStackRequestDto } from "@App/common/events/viewstack/ViewStackRequestDto";
import { EventHandlerContext } from "@App/common/events/EventHandlerContext";
import { ServerEventHandlerBase } from "@App/common/events/ServerEventHandlerBase";
import { CardStack } from "@App/common/mechanics/CardStack";
import { CardDto } from "@App/common/dto/CardDto";
import { Card } from "@App/common/mechanics/Card";

export class ViewStackServerEventHandler extends ServerEventHandlerBase {

    getEventType(): string {
        return EventType.ViewStack;
    }

    process(context: EventHandlerContext, data: any) {

        var req = data as ViewStackRequestDto;
        var stack = context.game.findActor(req.stackId) as CardStack;

        var source: Card[];
        var result: CardDto[] = [];

        switch (req.subStack) {
            case ViewStackRequestDto.cards:
                source = stack.cards;
                break;
            case ViewStackRequestDto.disposedCards:
                source = stack.disposedCards;
                break;
            default:
                this.respondError(context, "invalid substack: " + req.subStack);
                return;
        }

        context.serializer.serializeCardCollection(source, result);

        this.respondCaller(context, result);
        this.notifyAll(context, req);
    }

}
