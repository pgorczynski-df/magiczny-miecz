import { Subscription, Observable } from "rxjs";

import { HubConnection, HubConnectionBuilder, LogLevel } from "@aspnet/signalr";
import { Services } from "app/Services";
import { LoginResponse } from "./LoginResponse";
import { GameListDto } from "app/lobby/dto/GameListDto";
//import { Store } from '@ngrx/store';
//import * as directMessagesActions from './store/directmessages.action';
//import { OidcSecurityService } from 'angular-auth-oidc-client';
//import { OnlineUser } from './models/online-user';

(<any>global).XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
(<any>global).WebSocket = require("websocket").w3cwebsocket;

export class PlayerHubClient {

    private _hubConnection: HubConnection;

    isAuthorizedSubscription: Subscription;
    isAuthorized: boolean;

    constructor(
        private services: Services
        //private store: Store<any>,
        //private oidcSecurityService: OidcSecurityService
    ) {


    }

    sendDirectMessage(message: string, userId: string): string {

        this._hubConnection.invoke("SendMessage", message, userId);
        return message;
    }

    login(email: string, password: string): Observable<LoginResponse> {
        return this.invokeSimple<LoginResponse>("Token", email, password);
    }

    getMyGames(): Observable<GameListDto[]> {
        return this.invokeSimple<GameListDto[]>("GetMyGames");
    }

    getOpenGames(): Observable<GameListDto[]> {
        return this.invokeSimple<GameListDto[]>("GetOpenGames");
    }

    createGame(): Observable<GameListDto> {
        return this.invokeSimple<GameListDto>("CreateGame");
    }

    joinGame(gameId: string): Observable<any> {
        return this.invokeSimple<any>("JoinGame", gameId);
    }

    invokeSimple<T = any>(methodName: string, ...args: any[]): Observable<T> {
        return this.invoke<T>(methodName + "Request", methodName + "Response", ...args);
    }

    invoke<T = any>(requestMethodName: string, responseMethodName: string, ...args: any[]): Observable<T> {
        this.services.logger.debug(`Attempting to invoke method: ${requestMethodName}, args: ${args.join(", ")}`);

        var observable = Observable.create(observer => {

            this._hubConnection.on(responseMethodName, (res: T) => {
                this._hubConnection.off(responseMethodName);

                this.services.logger.debug(`Method: ${requestMethodName}, returned result`);
                this.services.logger.debug(res);

                observer.next(res);
                observer.complete();
            });

        });

        this._hubConnection.invoke(requestMethodName, ...args).catch(r => this.services.logger.error(r));

        return observable;
    }


    public init(token: string): Promise<void> {

        const url = "http://localhost:53048/";

        this._hubConnection = new HubConnectionBuilder()
            .withUrl(`${url}/playerhub`, {
                accessTokenFactory: () => {
                    //var token = token2 ?? this.services.authService.token;
                    this.services.logger.debug("Auth using token: " + token);
                    return token;
                }
            })
            .configureLogging(LogLevel.Information)
            .build();

        return this._hubConnection.start();
    }


    public publish(e) {
        this.services.logger.debug("sending event -> hub: ");
        this.services.logger.debug(e);
        this._hubConnection.send("Publish", e);
    }


    public attachEvents(callback: Function) {

        this._hubConnection.on("NewEvent", (event) => {

            this.services.logger.debug("received inbound from hub: ");
            this.services.logger.debug(event);

            //this.services.inboundBus.publish2(event);

            callback(event);

        });

        //this.services.outboundBus.of().subscribe(e => {
        //  this.services.logger.debug("sending outbound event: ");
        //  this.services.logger.debug(e);
        //  this._hubConnection.send("Publish", e);
        //});

    }
}
