import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import * as socketIo from 'socket.io-client';

import { Event } from "./game/Event";

const SERVER_URL = 'http://localhost:3000';


@Injectable()
export class SocketClient {
  public socket: any;

  public initSocket(): void {
    this.socket = socketIo(SERVER_URL);
  }

  public send(message: Event): void {
    this.socket.emit('Publish', message);
  }

  public onEvent(): Observable<Event> {
    return new Observable<Event>(observer => {
      this.socket.on('NewEvent', (data: Event) => observer.next(data));
    });
  }

}
