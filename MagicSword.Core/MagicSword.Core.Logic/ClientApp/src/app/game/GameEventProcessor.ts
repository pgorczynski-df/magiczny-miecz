import { Event } from "./Event";
import { EventType } from "./EventType";
import { IResponseProcessor } from "app/game/IResponseProcessor";
import { Services } from "../Services";
import { IGamesRepository } from "./repository/IGamesRepository";

export class GameEventProcessor {

    constructor(private services: Services, private responseProcessor: IResponseProcessor, private gamesRepository: IGamesRepository) {

    }

    processRequest(event: Event) {
        switch (event.eventType) {
            case EventType.JoinGameRequest:

                this.responseProcessor.registerCaller(event);
                this.gamesRepository.get(event.gameId).then(r => {
                    this.responseProcessor.respondCaller({
                        eventType: EventType.GameLoadResponse,
                        data: r,
                        gameId: event.gameId
                    });
                });


                break;

            default:
        }
    }

}