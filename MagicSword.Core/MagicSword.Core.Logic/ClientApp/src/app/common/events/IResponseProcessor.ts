import { Event } from "@Common/events/Event";
import { ErrorDto } from "@Common/dto/ErrorDto";

export interface IResponseProcessor {

    respondCaller(event: Event);

    respondAll(event: Event);

    respondError(data: ErrorDto);
}
