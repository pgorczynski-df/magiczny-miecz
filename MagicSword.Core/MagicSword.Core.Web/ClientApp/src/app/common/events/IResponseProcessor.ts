import { Event } from "@App/common/events/Event";

export interface IResponseProcessor {

    respondCaller(event: Event);

    respondAll(event: Event);

    respondError(data: any);
}
