import { EventType } from "@App/common/events/EventType";
import { ClientEventHandlerBase } from "@App/game/events/ClientEventHandlerBase";

export class CameraChangeEventHandler extends ClientEventHandlerBase {

    getEventType(): string {
        return EventType.CameraChange;
    }

    //DO NOT CONVERT TO MEMBER FUNCTION
    cameraChanged = (position: THREE.Object3D): void =>  {
        var dto = this.context.serializer.serializeObject3D(position);
        this.sendRequest(dto);
    }
}

