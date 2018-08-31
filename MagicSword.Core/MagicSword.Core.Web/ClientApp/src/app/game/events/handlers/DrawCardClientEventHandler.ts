import { Event } from "@App/common/events/Event";
import { DrawCardNotificationDto } from "@App/common/events/drawcard/DrawCardNotificationDto";
import { CardStack } from "@App/game/logic/CardStack";
import { DrawCardRequestDto } from "@App/common/events/drawcard/DrawCardRequestDto";
import { EventType } from "@App/common/events/EventType";
import { ClientEventHandlerBase } from "@App/game/events/ClientEventHandlerBase";

export class DrawCardClientEventHandler extends ClientEventHandlerBase {

    getEventType(): string {
        return EventType.DrawCard;
    }

    drawCard(uncover = true) {
        var stack = <CardStack>this.context.game.world.selectedActor;
        var request = new DrawCardRequestDto();
        request.stackId = stack.id;
        request.uncover = uncover;

        this.sendRequest(request);
    }

    processNotification(event: Event) {

        var world = this.context.game.world;

        var dto3 = event.data as DrawCardNotificationDto;
        var cardDto2 = dto3.cardDto;
        cardDto2.loaded = true;
        var originStack2 = world.cardStacks.find(a => a.definition.id === cardDto2.originStackDefinitionId);
        var card2 = this.context.serializer.deserializeCard(world, originStack2, cardDto2, true);

        //context.services.logger.info(`Gracz ${senderName} wyciągnał kartę ${card2.name}`);

    }

}

