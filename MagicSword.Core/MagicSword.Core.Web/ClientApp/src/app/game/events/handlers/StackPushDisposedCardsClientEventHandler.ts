import { Event } from "@App/common/events/Event";
import { StackPushDisposedCardsRequestDto } from "@App/common/events/stackpushdisposedcards/StackPushDisposedCardsRequestDto";
import { CardStack } from "@App/game/logic/CardStack";
import { EventType } from "@App/common/events/EventType";
import { ClientEventHandlerBase } from "@App/game/events/ClientEventHandlerBase";
import { StringUtils } from "@App/common/utils/StringUtils";

export class StackPushDisposedCardsClientEventHandler extends ClientEventHandlerBase {


    getEventType(): string {
        return EventType.StackPushDisposedCards;
    }

    putCards(stack: CardStack) {
        var dto = new StackPushDisposedCardsRequestDto();
        dto.stackId = stack.id;
        this.sendRequest(dto);
    }

    getMessage(event: Event): string {
        var dto = event.data as StackPushDisposedCardsRequestDto;
        var stack = this.context.game.findActor(dto.stackId) as CardStack;
        if (stack) {
            return StringUtils.format(this.r(), this.senderName(event), stack.name);
        } else {
            return event.eventType + " " + "error";
        }
    }

}

