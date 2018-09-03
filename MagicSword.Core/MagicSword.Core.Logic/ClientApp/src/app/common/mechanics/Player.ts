import { Object3D } from "@App/common/mechanics/Object3D";
import { Event } from "@App/common/events/Event";

export class Player {

    id: string;

    name: string;

    camera: Object3D = null;

    incomingEvents: Event[] = [];

    outboundEventIds: string[] = [];

}
