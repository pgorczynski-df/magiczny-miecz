import { EventHandlerContext } from "@App/common/events/EventHandlerContext";

export interface IServerEventHandler {

    getEventType(): string;

    process(context: EventHandlerContext, data: any);

}
