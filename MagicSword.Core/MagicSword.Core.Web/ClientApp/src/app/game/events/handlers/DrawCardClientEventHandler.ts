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

        var dto = event.data as DrawCardNotificationDto;

        if (dto.success) {
            var cardDto2 = dto.cardDto;
            var originStack2 = world.cardStacks.find(a => a.definition.id === cardDto2.originStackDefinitionId);
            this.context.serializer.deserializeCard(world, originStack2, cardDto2, true);
        }
    }

    getMessage(event: Event): string {

        var game = this.context.game;

        var dto = event.data as DrawCardNotificationDto;
        if (dto.success) {
            var actor = game.findActor(dto.cardDto.id);
            if (actor) {
                return StringUtils.format(this.r(), this.senderName(event), actor.name);
            }

            return event.eventType + " " + "error";
        } else {
            var stack = game.findActor(dto.stackId);
            if (stack) {
                return StringUtils.format(this.res(EventType.DrawCard + "_fail"), stack.name);
            }
        }

    }

}

