import { IResponseProcessor } from "@Common/events/IResponseProcessor";
import { Event } from "@Common/events/Event";
import { EventType } from "@Common/events/EventType";
import { EventKind } from "@Common/events/EventKind";
import { ClientServices } from "@App/ClientServices";

export class EventBusResponseProcessor implements IResponseProcessor {

    constructor(private services: ClientServices) {
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
