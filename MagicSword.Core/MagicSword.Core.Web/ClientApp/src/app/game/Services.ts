import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import * as Logger from "js-logger";

import {EventBus} from "./EventBus";

@Injectable()
export class Services {

  public logger: any;
  public inboundBus = new EventBus();
  public outboundBus = new EventBus();

  constructor(public httpClient: HttpClient) {

    Logger.useDefaults({ logLevel: Logger.DEBUG });

    this.logger = Logger;

  }

}
