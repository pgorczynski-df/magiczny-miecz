import { EventType } from "@App/common/events/EventType";
import { EventHandlerContext } from "@App/common/events/EventHandlerContext";
import { ActorDto } from "@App/common/dto/ActorDto";
import { ActorMoveServerEventHandler } from "@App/common/events/actormove/ActorMoveServerEventHandler";

export class ActorRotateServerEventHandler extends ActorMoveServerEventHandler {

    getEventType(): string {
        return EventType.ActorRotate;
    }
}
