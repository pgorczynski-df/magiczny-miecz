import { EventType } from "@App/common/events/EventType";
import { DrawCardRequestDto } from "@App/common/events/drawcard/DrawCardRequestDto";
import { DrawCardNotificationDto } from "@App/common/events/drawcard/DrawCardNotificationDto";
import { EventHandlerContext } from "@App/common/events/EventHandlerContext";
import { ServerEventHandlerBase } from "@App/common/events/ServerEventHandlerBase";

export class DrawCardServerEventHandler extends ServerEventHandlerBase {

    getEventType(): string {
        return EventType.DrawCard;
    }

    process(context: EventHandlerContext, data: any) {

        var args = data as DrawCardRequestDto;
        var card = context.game.world.drawCard(args.stackId, args.uncover);

        var res = new DrawCardNotificationDto();
        if (card !== null) {
            var cardDto = context.serializer.serializeCard(card);
            res.cardDto = cardDto;
            res.success = true;
        } else {
            res.stackId = args.stackId;
            res.success = false;
        }

        this.notifyAll(context, res);
    }

}
