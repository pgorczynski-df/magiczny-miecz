import { Event } from "@App/common/events/Event";
import { PickCardNotificationDto } from "@App/common/events/pickcard/PickCardNotificationDto";
import { PickCardRequestDto } from "@App/common/events/pickcard/PickCardRequestDto";
import { EventType } from "@App/common/events/EventType";
import { ClientEventHandlerBase } from "@App/game/events/ClientEventHandlerBase";
import { Card } from "@App/game/logic/Card";
import {StringUtils} from "@App/common/utils/StringUtils";

export class PickCardClientEventHandler extends ClientEventHandlerBase {

    getEventType(): string {
        return EventType.PickCard;
    }

    pickCard(card: Card) {
        var request = new PickCardRequestDto();
        request.stackId = card.originStack.id;
        request.cardId = card.id;
        //request.uncover = uncover;

        this.sendRequest(request);
    }

    processNotification(event: Event) {

        var world = this.context.game.world;

        var dto3 = event.data as PickCardNotificationDto;
        var cardDto2 = dto3.cardDto;
        cardDto2.loaded = true;
        var originStack2 = world.cardStacks.find(a => a.definition.id === cardDto2.originStackDefinitionId);
        this.context.serializer.deserializeCard(world, originStack2, cardDto2, true);
    }

    getMessage(event: Event): string {

        var game = this.context.game;

        var dto3 = event.data as PickCardNotificationDto;
        var actor = game.findActor(dto3.cardDto.id);
        if (actor) {
            return StringUtils.format(this.r(), this.senderName(event), actor.name);
        }

        return event.eventType + " " + "error";
    }

}

