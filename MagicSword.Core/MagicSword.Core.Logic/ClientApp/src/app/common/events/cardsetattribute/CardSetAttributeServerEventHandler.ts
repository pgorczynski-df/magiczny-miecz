import { EventType } from "@Common/events/EventType";
import { CardSetAttributeRequestDto } from "@Common/events/cardsetattribute/CardSetAttributeRequestDto";
import { EventHandlerContext } from "@Common/events/EventHandlerContext";
import { ServerEventHandlerBase } from "@Common/events/ServerEventHandlerBase";
import {Card} from "@Common/mechanics/Card";

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
