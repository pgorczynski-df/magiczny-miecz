import { Event } from "@App/common/events/Event";

export class GameStateDto {

    public currentPlayerId: string;

    public data: any;

    notificationEvents: Event[] = [];

}

