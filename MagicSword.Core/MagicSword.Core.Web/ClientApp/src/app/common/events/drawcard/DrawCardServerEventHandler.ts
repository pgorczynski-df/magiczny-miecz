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
        var cardDto = context.serializer.serializeCard(card);
        var res = new DrawCardNotificationDto();
        res.cardDto = cardDto;

        this.notifyAll(context, res);

    }

}
