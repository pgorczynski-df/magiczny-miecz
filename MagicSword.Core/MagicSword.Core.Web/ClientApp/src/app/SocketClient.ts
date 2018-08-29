import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import * as socketIo from "socket.io-client";

import { Event } from "@App/game/Event";
import { Services } from "@App/Services";

@Injectable()
export class SocketClient {

    private socket: SocketIOClient.Socket;

    constructor(private services: Services) {
    }

    public init(): void {

        this.socket = socketIo(this.services.settings.gameServerUrl);

        this.socket.on("NewEvent", (event: Event) => {
            this.services.logger.debug("received inbound event:");
            this.services.logger.debug(event);
            this.services.inboundBus.publish2(event);
        });

        this.services.outboundBus.of().subscribe((e : Event) => {
            this.services.logger.debug("sending outbound event:");
            this.services.logger.debug(e);

            e.token = this.services.authService.token;
            this.socket.emit("Publish", e);
        });

    }
}
