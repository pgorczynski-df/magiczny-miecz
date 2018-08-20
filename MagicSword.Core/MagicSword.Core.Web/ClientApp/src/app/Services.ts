import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import * as Logger from "js-logger";

import { EventBus } from "app/game/EventBus";
import { AuthService } from "@App/AuthService";
import { Settings } from "@App/common/infrastructure/Settings";

@Injectable()
export class Services {

    public logger: any;
    public inboundBus = new EventBus();
    public outboundBus = new EventBus();

    public settings = new Settings();

    constructor(public httpClient: HttpClient, public authService: AuthService) {

        Logger.useDefaults({ logLevel: Logger.DEBUG });

        this.logger = Logger;

    }

}
