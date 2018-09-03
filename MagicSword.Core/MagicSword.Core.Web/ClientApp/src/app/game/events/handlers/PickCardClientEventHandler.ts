import { Event } from "@App/common/events/Event";
import { PickCardNotificationDto } from "@App/common/events/pickcard/PickCardNotificationDto";
import { PickCardRequestDto } from "@App/common/events/pickcard/PickCardRequestDto";
import { EventType } from "@App/common/events/EventType";
import { ClientEventHandlerBase } from "@App/game/events/ClientEventHandlerBase";
import { Card } from "@App/game/logic/Card";

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
        var card2 = this.context.serializer.deserializeCard(world, originStack2, cardDto2, true);

        //context.services.logger.info(`Gracz ${senderName} wyciągnał kartę ${card2.name}`);

    }

}

