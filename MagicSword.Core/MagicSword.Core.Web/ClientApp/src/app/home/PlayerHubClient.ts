import { Subscription, Observable } from "rxjs";

import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { HubConnection, HubConnectionBuilder, LogLevel } from "@aspnet/signalr";
import { Services } from "app/Services";
import {LoginResponse} from "./LoginResponse";
import {GameListDto} from "app/lobby/dto/GameListDto";
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

  }

  sendDirectMessage(message: string, userId: string): string {

    this._hubConnection.invoke("SendMessage", message, userId);
    return message;
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.invoke<LoginResponse>("Token", "TokenResponse", email, password);
  }

  getMyGames(): Observable<GameListDto[]> {
    return this.invokeSimple<GameListDto[]>("GetMyGames");
  }

  createGame(): Observable<GameListDto> {
    return this.invokeSimple<GameListDto>("CreateGame");
  }

  invokeSimple<T = any>(methodName: string, ...args: any[]): Observable<T> {
    return this.invoke<T>(methodName + "Request", methodName + "Response", args);
  }

  invoke<T = any>(requestMethodName: string, responseMethodName: string, ...args: any[]): Observable<T> {
    this.services.logger.debug(`Attempting to invoke method: ${requestMethodName}, args: ${args.join(", ")}`);

    var observable = Observable.create(observer => {

      this._hubConnection.on(responseMethodName, (res: T) => {
        this._hubConnection.off(responseMethodName);

        observer.next(res);
        observer.complete();
      });

    });

    this._hubConnection.invoke(requestMethodName, args).then(r => console.log(r), r => console.error(r));

    return observable;
  }

  public  init() {
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
    const url = "http://localhost:53048/";

    this._hubConnection = new HubConnectionBuilder()
      .withUrl(`${url}/playerhub`, { accessTokenFactory: () => this.services.authService.token })
      .configureLogging(LogLevel.Information)
      .build();

    this._hubConnection.start().catch(err =>
      this.services.logger.error(err));


  }
}
