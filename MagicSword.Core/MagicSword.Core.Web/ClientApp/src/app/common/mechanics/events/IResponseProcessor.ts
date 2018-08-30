import { Event } from "./Event";

export interface IResponseProcessor {

    registerCaller(event: Event);

    respondCaller(event: Event);

    respondAll(event: Event);
}
