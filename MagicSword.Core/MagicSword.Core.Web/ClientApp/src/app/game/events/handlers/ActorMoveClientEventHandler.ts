import { Event } from "@App/common/events/Event";
import { EventType } from "@App/common/events/EventType";
import { ClientEventHandlerBase } from "@App/game/events/ClientEventHandlerBase";
import { ActorDto } from "@App/common/dto/ActorDto";
import { IActor } from "@App/game/logic/IActor";

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
            //this.services.logger.info(`Gracz ${senderName} przesunął kartę ${actor.name}`);
        } else {
            //this.services.logger.warn(`Cannot find actor with id: ${actorDto.id}`);
        }

    }

}

