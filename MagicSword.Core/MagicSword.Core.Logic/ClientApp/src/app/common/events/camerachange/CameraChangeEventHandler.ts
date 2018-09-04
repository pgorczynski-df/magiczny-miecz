import { EventType } from "@App/common/events/EventType";
import { EventHandlerContext } from "@App/common/events/EventHandlerContext";
import { ServerEventHandlerBase } from "@App/common/events/ServerEventHandlerBase";
import { Object3D } from "@App/common/mechanics/Object3D";
import { Object3DDto } from "@App/common/dto/Object3DDto";

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
