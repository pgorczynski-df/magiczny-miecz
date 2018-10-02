import { EventType } from "@Common/events/EventType";
import { ActorMoveServerEventHandler } from "@Common/events/actormove/ActorMoveServerEventHandler";

export class ActorRotateServerEventHandler extends ActorMoveServerEventHandler {

    getEventType(): string {
        return EventType.ActorRotate;
    }
}
