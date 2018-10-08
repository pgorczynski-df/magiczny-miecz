import { Injectable } from "@angular/core";

import { Services } from "@Common/infrastructure/Services";

import { EventBus } from "@App/game/EventBus";
import { AuthService } from "@App/AuthService";

@Injectable()
export class ClientServices extends Services {

    public inboundBus = new EventBus();
    public outboundBus = new EventBus();

    get clientAuthService() {
        return this.authService as AuthService;
    }

    constructor(public authService: AuthService) {
        super(authService);
    }

}
