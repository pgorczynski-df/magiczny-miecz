import { Event } from "@Common/events/Event";
import { Object3DDto } from "@Common/dto/Object3DDto";

export class PlayerDto {

    id: string;

    name: string;

    camera = new Object3DDto();

    incomingEvents: Event[] = [];

    outboundEventIds: string[] = [];
}
