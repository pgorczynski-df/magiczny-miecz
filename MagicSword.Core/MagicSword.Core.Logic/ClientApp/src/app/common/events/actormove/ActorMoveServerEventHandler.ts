import { EventType } from "@Common/events/EventType";
import { EventHandlerContext } from "@Common/events/EventHandlerContext";
import { ServerEventHandlerBase } from "@Common/events/ServerEventHandlerBase";
import { ActorDto } from "@Common/dto/ActorDto";

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
