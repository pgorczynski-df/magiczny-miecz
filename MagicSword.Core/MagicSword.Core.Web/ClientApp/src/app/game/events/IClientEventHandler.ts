import { Event } from "@Common/events/Event";
import {ClientEventHandlerContext} from "@App/game/events/ClientEventHandlerContext";

export interface IClientEventHandler {

    context: ClientEventHandlerContext;

    getEventType(): string;

    processNotification(event: Event);

    processResponse(event: Event);

    getMessage(event: Event);

}
