import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import * as Logger from "js-logger";

import {EventBus} from "./EventBus";

@Injectable()
export class Services {

  logger: any;

  constructor(public httpClient: HttpClient, public inboundBus: EventBus, public outboundBus: EventBus) {

    Logger.useDefaults({ logLevel: Logger.DEBUG });

    this.logger = Logger;

  }

}
