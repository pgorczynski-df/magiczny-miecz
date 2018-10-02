import { Event } from "@Common/events/Event";

export class GameStateDto {

    public currentPlayerId: string;

    public data: any;

    notificationEvents: Event[] = [];

}

