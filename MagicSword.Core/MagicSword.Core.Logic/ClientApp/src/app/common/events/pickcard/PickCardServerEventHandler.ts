import { EventType } from "@Common/events/EventType";
import { PickCardRequestDto } from "@Common/events/pickcard/PickCardRequestDto";
import { PickCardNotificationDto } from "@Common/events/pickcard/PickCardNotificationDto";
import { EventHandlerContext } from "@Common/events/EventHandlerContext";
import { ServerEventHandlerBase } from "@Common/events/ServerEventHandlerBase";

export class PickCardServerEventHandler extends ServerEventHandlerBase {

    getEventType(): string {
        return EventType.PickCard;
    }

    process(context: EventHandlerContext, data: any) {

        var args = data as PickCardRequestDto;
        var card = context.game.world.pickCard(args.stackId, args.cardId);
        var cardDto = context.serializer.serializeCard(card);
        var res = new PickCardNotificationDto();
        res.cardDto = cardDto;

        this.notifyAll(context, res);

    }

}
