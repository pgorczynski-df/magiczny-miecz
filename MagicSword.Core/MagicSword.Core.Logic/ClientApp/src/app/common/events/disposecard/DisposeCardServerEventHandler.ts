import { EventType } from "@App/common/events/EventType";
import { DisposeCardRequestDto } from "@App/common/events/disposecard/DisposeCardRequestDto";
import { DisposeCardNotificationDto } from "@App/common/events/disposecard/DisposeCardNotificationDto";
import { EventHandlerContext } from "@App/common/events/EventHandlerContext";
import { ServerEventHandlerBase } from "@App/common/events/ServerEventHandlerBase";

export class DisposeCardServerEventHandler extends ServerEventHandlerBase {

    getEventType(): string {
        return EventType.DisposeCard;
    }

    process(context: EventHandlerContext, data: any) {

        var args = data as DisposeCardRequestDto;
        var card = context.game.world.disposeCard(args.stackId, args.cardId);
        var cardDto = context.serializer.serializeCard(card);
        var res = new DisposeCardNotificationDto();
        res.cardDto = cardDto;

        this.notifyAll(context, res);

    }

}
