import { EventType } from "@Common/events/EventType";
import { EventHandlerContext } from "@Common/events/EventHandlerContext";
import { ServerEventHandlerBase } from "@Common/events/ServerEventHandlerBase";
import { Object3D } from "@Common/mechanics/Object3D";
import { Object3DDto } from "@Common/dto/Object3DDto";

export class CameraChangeEventHandler extends ServerEventHandlerBase {

    isTransient(): boolean {
        return true;
    }

    getEventType(): string {
        return EventType.CameraChange;
    }

    process(context: EventHandlerContext, data: any) {

        var player = context.callingPlayer;
        if (!player.camera) {
            player.camera = new Object3D();
        }
        context.serializer.deserializeObject3D(data as Object3DDto, player.camera);

    }

}
