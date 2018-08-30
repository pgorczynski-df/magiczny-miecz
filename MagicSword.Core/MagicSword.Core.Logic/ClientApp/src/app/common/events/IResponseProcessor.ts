import { Event } from "@App/common/events/Event";

export interface IResponseProcessor {

    registerCaller(event: Event);

    respondCaller(event: Event);

    respondAll(event: Event);
}
