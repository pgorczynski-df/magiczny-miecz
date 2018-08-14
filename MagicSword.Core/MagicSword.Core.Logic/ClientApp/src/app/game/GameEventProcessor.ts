import { Event } from "./Event";
import { EventType } from "./EventType";
import {IResponseProcessor} from "app/game/IResponseProcessor";

export class GameEventProcessor {

  constructor(private responseProcessor: IResponseProcessor) {

  }

  processRequest(event: Event) {
    switch (event.eventType) {
      case EventType.JoinGameRequest:

        this.responseProcessor.registerCaller(event);

        break;

      default:
    }
  }

}