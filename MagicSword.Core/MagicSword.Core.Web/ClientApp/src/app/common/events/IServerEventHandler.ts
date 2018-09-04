import { EventHandlerContext } from "@App/common/events/EventHandlerContext";

export interface IServerEventHandler {

    isTransient(): boolean;

    getEventType(): string;

    process(context: EventHandlerContext, data: any);

}
