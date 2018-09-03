import { EventType } from "@App/common/events/EventType";
import { ActorMoveServerEventHandler } from "@App/common/events/actormove/ActorMoveServerEventHandler";

export class ActorRotateServerEventHandler extends ActorMoveServerEventHandler {

    getEventType(): string {
        return EventType.ActorRotate;
    }
}
