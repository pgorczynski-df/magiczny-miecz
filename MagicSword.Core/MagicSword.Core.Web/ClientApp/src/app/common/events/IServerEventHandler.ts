import { Event } from "@App/common/events/Event";
import { EventHandlerContext } from "@App/common/events/EventHandlerContext";

export interface IServerEventHandler {

    getEventType(): string;

    process(context: EventHandlerContext, event: Event);

}
