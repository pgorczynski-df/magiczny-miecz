import { Event } from "@App/common/events/Event";
import { DisposeCardNotificationDto } from "@App/common/events/disposecard/DisposeCardNotificationDto";
import { DisposeCardRequestDto } from "@App/common/events/disposecard/DisposeCardRequestDto";
import { EventType } from "@App/common/events/EventType";
import { ClientEventHandlerBase } from "@App/game/events/ClientEventHandlerBase";
import { Card } from "@App/game/logic/Card";
import { StringUtils } from "@App/common/utils/StringUtils";

export class DisposeCardClientEventHandler extends ClientEventHandlerBase {

    getEventType(): string {
        return EventType.DisposeCard;
    }

    disposeCard(card: Card) {
        var request = new DisposeCardRequestDto();
        request.stackId = card.originStack.id;
        request.cardId = card.id;
        this.sendRequest(request);
    }

    processNotification(event: Event) {
        var dto3 = event.data as DisposeCardNotificationDto;
        var cardDto2 = dto3.cardDto;
        var card = this.context.game.findActor(cardDto2.id) as Card;
        if (card) {
            this.context.game.world.disposeCard(card);
        }
    }

    getMessage(event: Event): string {

        var game = this.context.game;

        var dto3 = event.data as DisposeCardNotificationDto;
        var actor = game.findActor(dto3.cardDto.id);
        if (actor) {
            return StringUtils.format(this.r(), this.senderName(event), actor.name);
        }

        return event.eventType + " " + "error";
    }

}

