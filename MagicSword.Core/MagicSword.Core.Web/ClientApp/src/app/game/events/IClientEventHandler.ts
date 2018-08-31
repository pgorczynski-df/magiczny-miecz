import { Event } from "@App/common/events/Event";
import {ClientEventHandlerContext} from "@App/game/events/ClientEventHandlerContext";

export interface IClientEventHandler {

    context: ClientEventHandlerContext;

    getEventType(): string;

    processNotification(event: Event);

    processResponse(event: Event);

}
