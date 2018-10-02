import { Object3D } from "@Common/mechanics/Object3D";
import { Event } from "@Common/events/Event";

export class Player {

    id: string;

    name: string;

    camera: Object3D = null;

    incomingEvents: Event[] = [];

    outboundEventIds: string[] = [];

}
