import { EventHandlerContext } from "@Common/events/EventHandlerContext";

export interface IServerEventHandler {

    isTransient(): boolean;

    getEventType(): string;

    process(context: EventHandlerContext, data: any);

}
