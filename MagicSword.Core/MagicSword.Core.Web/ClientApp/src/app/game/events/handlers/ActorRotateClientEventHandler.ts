import { EventType } from "@App/common/events/EventType";
import { ActorMoveClientEventHandler } from "@App/game/events/handlers/ActorMoveClientEventHandler";

export class ActorRotateClientEventHandler extends ActorMoveClientEventHandler {

    getEventType(): string {
        return EventType.ActorRotate;
    }

}

