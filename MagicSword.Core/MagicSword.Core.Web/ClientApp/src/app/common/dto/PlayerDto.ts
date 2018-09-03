import { Event } from "@App/common/events/Event";
import { Object3DDto } from "@App/common/dto/Object3DDto";

export class PlayerDto {

    id: string;

    name: string;

    camera = new Object3DDto();

    incomingEvents: Event[] = [];

    outboundEventIds: string[] = [];

}
