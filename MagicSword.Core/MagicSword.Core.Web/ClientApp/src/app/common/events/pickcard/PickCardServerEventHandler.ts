import { EventType } from "@App/common/events/EventType";
import { PickCardRequestDto } from "@App/common/events/pickcard/PickCardRequestDto";
import { PickCardNotificationDto } from "@App/common/events/pickcard/PickCardNotificationDto";
import { EventHandlerContext } from "@App/common/events/EventHandlerContext";
import { ServerEventHandlerBase } from "@App/common/events/ServerEventHandlerBase";

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
