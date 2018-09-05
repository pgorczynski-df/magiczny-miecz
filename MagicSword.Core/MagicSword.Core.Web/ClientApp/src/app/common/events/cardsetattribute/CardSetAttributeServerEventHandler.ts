import { EventType } from "@App/common/events/EventType";
import { CardSetAttributeRequestDto } from "@App/common/events/cardsetattribute/CardSetAttributeRequestDto";
import { EventHandlerContext } from "@App/common/events/EventHandlerContext";
import { ServerEventHandlerBase } from "@App/common/events/ServerEventHandlerBase";
import {Card} from "@App/common/mechanics/Card";

export class CardSetAttributeServerEventHandler extends ServerEventHandlerBase {

    getEventType(): string {
        return EventType.CardSetAttribute;
    }

    process(context: EventHandlerContext, data: any) {

        var args = data as CardSetAttributeRequestDto;

        var card = context.game.findActor(args.cardId) as Card;
        card.setAttribute(args.attributeName, args.newValue);

        //var cardDto = context.serializer.serializeCard(card);

        this.notifyAll(context, args);

    }

}
