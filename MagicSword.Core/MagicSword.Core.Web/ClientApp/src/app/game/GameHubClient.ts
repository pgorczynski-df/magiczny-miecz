import { Subscription } from 'rxjs';

import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import {Services} from "./Services";
//import { Store } from '@ngrx/store';
//import * as directMessagesActions from './store/directmessages.action';
//import { OidcSecurityService } from 'angular-auth-oidc-client';
//import { OnlineUser } from './models/online-user';

@Injectable()
export class GameHubClient {

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
    this.headers = this.headers.set('Content-Type', 'application/json');
    this.headers = this.headers.set('Accept', 'application/json');

    this.init();
  }

  sendDirectMessage(message: string, userId: string): string {

    this._hubConnection.invoke('SendMessage', message, userId);
    return message;
  }

  leave(): void {
    this._hubConnection.invoke('Leave');
  }

  join(): void {
    console.log('send join');
    this._hubConnection.invoke('Join');
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
    console.log('initHub');
    const token = ""; // this.oidcSecurityService.getToken();
    let tokenValue = '';
    if (token !== '') {
      tokenValue = '?token=' + token;
    }
    const url = 'https://localhost:44320/';

    this._hubConnection = new HubConnectionBuilder()
      .withUrl(`${url}/gamehub${tokenValue}`)
      .configureLogging(LogLevel.Information)
      .build();

    this._hubConnection.start().catch(err =>
      this.services.logger.error(err));

    this._hubConnection.on("NewEvent", (event) => {
      //const msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      //const encodedMsg = user + " says " + msg;
      //const li = document.createElement("li");
      //li.textContent = encodedMsg;
      //document.getElementById("messagesList").appendChild(li);

      this.services.logger.debug(event);

      this.services.inboundBus.publish(event);

    });

    //this._hubConnection.on('NewOnlineUser', (onlineUser: OnlineUser) => {
    //    console.log('NewOnlineUser received');
    //    console.log(onlineUser);
    //    this.store.dispatch(new directMessagesActions.ReceivedNewOnlineUser(onlineUser));
    //});

    //this._hubConnection.on('OnlineUsers', (onlineUsers: OnlineUser[]) => {
    //    console.log('OnlineUsers received');
    //    console.log(onlineUsers);
    //    this.store.dispatch(new directMessagesActions.ReceivedOnlineUsers(onlineUsers));
    //});

    //this._hubConnection.on('Joined', (onlineUser: OnlineUser) => {
    //    console.log('Joined received');
    //    this.store.dispatch(new directMessagesActions.JoinSent());
    //    console.log(onlineUser);
    //});

    //this._hubConnection.on('SendDM', (message: string, onlineUser: OnlineUser) => {
    //    console.log('SendDM received');
    //    this.store.dispatch(new directMessagesActions.ReceivedDirectMessage(message, onlineUser));
    //});

    //this._hubConnection.on('UserLeft', (name: string) => {
    //    console.log('UserLeft received');
    //    this.store.dispatch(new directMessagesActions.ReceivedUserLeft(name));
    //});
  }
}
