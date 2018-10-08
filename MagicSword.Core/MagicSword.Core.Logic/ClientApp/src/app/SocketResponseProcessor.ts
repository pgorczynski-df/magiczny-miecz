import * as socketIo from "socket.io";
import { IResponseProcessor } from "@Common/events/IResponseProcessor";
import { Services } from "@Common/infrastructure/Services";
import { Event } from "@Common/events/Event";
import { EventType } from "@Common/events/EventType";
import { EventKind } from "@Common/events/EventKind";

export class SocketResponseProcessor implements IResponseProcessor {

    constructor(private services: Services, private io: SocketIO.Server, private socket: socketIo.Socket) {
    }

    registerCaller(event: Event) {
        //this.services.logger.debug("Registering caller");
        this.socket.join(this.roomId(event.gameId));
    }

    respondCaller(event: Event) {
        event.token = null;
        this.services.logger.debug("Sending response to caller");
        this.services.logger.debug(event);

        this.socket.emit("NewEvent", event);
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
        event.token = null;
        this.services.logger.debug("Sending response to room");
        this.services.logger.debug(event);

        this.io.to(this.roomId(event.gameId)).emit('NewEvent', event);
    }

    private roomId(gameId: string) {
        return "Game_" + gameId;
    }
}
