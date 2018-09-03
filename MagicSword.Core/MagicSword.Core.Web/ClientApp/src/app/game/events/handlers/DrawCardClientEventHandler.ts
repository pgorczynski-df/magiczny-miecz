import { Event } from "@App/common/events/Event";
import { DrawCardNotificationDto } from "@App/common/events/drawcard/DrawCardNotificationDto";
import { CardStack } from "@App/game/logic/CardStack";
import { DrawCardRequestDto } from "@App/common/events/drawcard/DrawCardRequestDto";
import { EventType } from "@App/common/events/EventType";
import { ClientEventHandlerBase } from "@App/game/events/ClientEventHandlerBase";
import { StringUtils } from "@App/common/utils/StringUtils";

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
        var originStack2 = world.cardStacks.find(a => a.definition.id === cardDto2.originStackDefinitionId);
        this.context.serializer.deserializeCard(world, originStack2, cardDto2, true);
    }

    getMessage(event: Event): string {

        var game = this.context.game;

        var dto3 = event.data as DrawCardNotificationDto;
        var actor = game.findActor(dto3.cardDto.id);
        if (actor) {
            return StringUtils.format(this.r(), this.senderName(event), actor.name);
        }

        return event.eventType + " " + "error";
    }

}

