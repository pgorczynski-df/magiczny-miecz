import { EventType } from "@App/common/events/EventType";
import { EventHandlerContext } from "@App/common/events/EventHandlerContext";
import { ActorDto } from "@App/common/dto/ActorDto";
import { ActorMoveServerEventHandler } from "@App/common/events/actormove/ActorMoveServerEventHandler";

export class ActorRotateServerEventHandler extends ActorMoveServerEventHandler {

    getEventType(): string {
        return EventType.ActorRotate;
    }

    process(context: EventHandlerContext, data: any) {

        var actorDto = data as ActorDto;
        var actor = context.game.findActor(actorDto.id);
        if (actor) {
            context.serializer.deserializeActor(actorDto, actor);
            this.notifyAll(context, actorDto);
        } else {
            this.respondError(context, "Could not find actor id = " + actorDto.id);
        }

    }

}
