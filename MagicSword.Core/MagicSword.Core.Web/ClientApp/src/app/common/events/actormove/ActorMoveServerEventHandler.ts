import { EventType } from "@App/common/events/EventType";
import { EventHandlerContext } from "@App/common/events/EventHandlerContext";
import { ServerEventHandlerBase } from "@App/common/events/ServerEventHandlerBase";
import { ActorDto } from "@App/common/dto/ActorDto";

export class ActorMoveServerEventHandler extends ServerEventHandlerBase {

    getEventType(): string {
        return EventType.ActorMove;
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
