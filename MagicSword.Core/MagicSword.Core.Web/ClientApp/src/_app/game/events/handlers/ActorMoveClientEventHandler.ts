import { Event } from "@Common/events/Event";
import { EventType } from "@Common/events/EventType";
import { ClientEventHandlerBase } from "@App/game/events/ClientEventHandlerBase";
import { ActorDto } from "@Common/dto/ActorDto";
import { IActor } from "@App/game/logic/IActor";
import { StringUtils } from "@Common/utils/StringUtils";

export class ActorMoveClientEventHandler extends ClientEventHandlerBase {

    getEventType(): string {
        return EventType.ActorMove;
    }

    moveActor(actor: IActor) {
        var actorDto = this.context.serializer.serializeActor(actor);
        this.sendRequest(actorDto);
    }

    processNotification(event: Event) {

        var game = this.context.game;

        var actorDto = event.data as ActorDto;
        var actor = game.findActor(actorDto.id);
        if (actor) {
            this.context.serializer.deserializeActor(actorDto, actor);
        } 

    }

    getMessage(event: Event): string {

        var game = this.context.game;

        var actorDto = event.data as ActorDto;
        var actor = game.findActor(actorDto.id);
        if (actor) {
            return StringUtils.format(this.r(), this.senderName(event), actor.name);
        }

        return event.eventType + " " + "error";
    }

}

