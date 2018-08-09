
import * as Logger from "js-logger";

//import { EventBus } from "app/game/EventBus";
import { AuthService } from "app/AuthService";

export class Services {

  public logger: any;
  //public inboundBus = new EventBus();
  //public outboundBus = new EventBus();

  constructor(public authService: AuthService) {

    Logger.useDefaults({ logLevel: Logger.DEBUG });

    this.logger = Logger;

  }

}
