import { Injectable } from "@angular/core";

import * as Logger from "js-logger";

import { EventBus } from "@App/game/EventBus";
import { AuthService } from "@App/AuthService";
import { Settings } from "@Common/infrastructure/Settings";

@Injectable()
export class Services {

    public logger: any;
    public inboundBus = new EventBus();
    public outboundBus = new EventBus();

    public settings = new Settings();

    constructor(public authService: AuthService) {

        Logger.useDefaults({ logLevel: Logger.DEBUG });

        this.logger = Logger;

    }

}
