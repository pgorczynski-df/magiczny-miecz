import * as Logger from "js-logger";

import { Settings } from "@Common/infrastructure/Settings";
import { AuthServiceBase } from "@Common/infrastructure/AuthServiceBase";

export class Services {

    public logger: any;

    public settings = new Settings();

    constructor(public authService: AuthServiceBase) {
        Logger.useDefaults({ logLevel: Logger.DEBUG });
        this.logger = Logger;
    }

}
