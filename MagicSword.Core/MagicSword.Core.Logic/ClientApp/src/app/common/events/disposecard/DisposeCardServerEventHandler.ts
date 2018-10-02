import { EventType } from "@Common/events/EventType";
import { DisposeCardRequestDto } from "@Common/events/disposecard/DisposeCardRequestDto";
import { DisposeCardNotificationDto } from "@Common/events/disposecard/DisposeCardNotificationDto";
import { EventHandlerContext } from "@Common/events/EventHandlerContext";
import { ServerEventHandlerBase } from "@Common/events/ServerEventHandlerBase";

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
