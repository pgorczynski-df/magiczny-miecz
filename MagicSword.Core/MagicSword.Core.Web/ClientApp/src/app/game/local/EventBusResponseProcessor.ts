import { IResponseProcessor } from "@App/common/events/IResponseProcessor";
import { Services } from "@App/Services";
import { Event } from "@App/common/events/Event";
import { EventType } from "@App/common/events/EventType";
import { EventKind } from "@App/common/events/EventKind";

export class EventBusResponseProcessor implements IResponseProcessor {

    constructor(private services: Services) {
    }

    respondCaller(event: Event) {
        this.services.logger.debug("Sending response to caller");
        this.services.logger.debug(event);
        this.services.inboundBus.publish2(event);
    }

    respondError(data: any) {
        this.services.logger.error(data);
        this.respondCaller({
            eventType: EventType.Error,
            eventKind: EventKind.Response,
            data: data,
        } as any);
    }

    respondAll(event: Event) {
        this.services.logger.debug("Sending response to room");
        this.services.logger.debug(event);

        this.respondCaller(event);
    }

    private roomId(gameId: string) {
        return "Game_" + gameId;
    }
}
