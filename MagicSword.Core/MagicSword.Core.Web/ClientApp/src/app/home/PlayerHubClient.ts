import { Subscription } from "rxjs";

import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { HubConnection, HubConnectionBuilder, LogLevel } from "@aspnet/signalr";
import { Services } from "app/Services";
import {LoginResponse} from "./LoginResponse";
//import { Store } from '@ngrx/store';
//import * as directMessagesActions from './store/directmessages.action';
//import { OidcSecurityService } from 'angular-auth-oidc-client';
//import { OnlineUser } from './models/online-user';

@Injectable()
export class PlayerHubClient {

  private _hubConnection: HubConnection;
  private headers: HttpHeaders;

  isAuthorizedSubscription: Subscription;
  isAuthorized: boolean;

  constructor(
    private services: Services
    //private store: Store<any>,
    //private oidcSecurityService: OidcSecurityService
  ) {
    this.headers = new HttpHeaders();
    this.headers = this.headers.set("Content-Type", "application/json");
    this.headers = this.headers.set("Accept", "application/json");

    this.init();
  }

  sendDirectMessage(message: string, userId: string): string {

    this._hubConnection.invoke("SendMessage", message, userId);
    return message;
  }

  login(email: string, password: string): void {
    this.services.logger.debug("Attempting to login: " + email + " " + password);
    this._hubConnection.invoke("Token", email, password);
  }

  private init() {
    //this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
    //    (isAuthorized: boolean) => {
    //        this.isAuthorized = isAuthorized;
    //        if (this.isAuthorized) {
    this.initHub();
    //        }
    //    });
    //console.log('IsAuthorized:' + this.isAuthorized);
  }

  private initHub() {
    console.log("initHub");
    const token = ""; // this.oidcSecurityService.getToken();
    let tokenValue = "";
    if (token !== "") {
      tokenValue = "?token=" + token;
    }
    const url = "http://localhost:50411/";

    this._hubConnection = new HubConnectionBuilder()
      .withUrl(`${url}/playerhub`, { accessTokenFactory: () => "token" })
      .configureLogging(LogLevel.Information)
      .build();

    this._hubConnection.on("TokenResponse", (res : LoginResponse) => {
      console.log(res);
    });

    this._hubConnection.start().catch(err =>
      this.services.logger.error(err));


  }
}
