import { Event } from "@App/common/events/Event";
import { CardSetAttributeRequestDto } from "@App/common/events/cardsetattribute/CardSetAttributeRequestDto";
import { EventType } from "@App/common/events/EventType";
import { ClientEventHandlerBase } from "@App/game/events/ClientEventHandlerBase";
import { Card } from "@App/game/logic/Card";
import { StringUtils } from "@App/common/utils/StringUtils";

export class CardSetAttributeClientEventHandler extends ClientEventHandlerBase {

    getEventType(): string {
        return EventType.CardSetAttribute;
    }

    addAttribute(card: Card, attributeName: string) {
        this.setValue(card, attributeName, 1);
    }

    clearAttribute(card: Card, attributeName: string) {
        this.setValue(card, attributeName, null);
    }

    toggleAttribute(card: Card, attributeName: string) {
        var attr = card.getAttribute(attributeName);
        if (attr) {
            this.clearAttribute(card, attributeName);
        } else {
            this.addAttribute(card, attributeName);
        }
    }

    increment(card: Card, attributeName: string, value: number) {
        var currentValue = card.getAttribute(attributeName);
        currentValue = currentValue ? currentValue + value : 1;
        this.setValue(card, attributeName, currentValue);
    }

    private setValue(card: Card, attributeName: string, value: number) {
        var request = new CardSetAttributeRequestDto();
        request.stackId = card.originStack.id;
        request.cardId = card.id;
        request.attributeName = attributeName;
        request.newValue = value;
        this.sendRequest(request);
    }

    processNotification(event: Event) {
        var cardDto = event.data as CardSetAttributeRequestDto;
        var card = this.context.game.findActor(cardDto.cardId) as Card;
        if (card) {
            card.setAttribute(cardDto.attributeName, cardDto.newValue);
            //this.context.game.world.disposeCard(card);
        }
    }

    getMessage(event: Event): string {

        var game = this.context.game;

        var cardDto = event.data as CardSetAttributeRequestDto;
        var actor = game.findActor(cardDto.cardId);
        if (actor) {
            return StringUtils.format(this.r(), this.senderName(event), actor.name, this.res(cardDto.attributeName), cardDto.newValue + "");
        }

        return event.eventType + " " + "error";
    }

}

