import { Observable, Subject } from "rxjs";
import { filter } from "rxjs/operators";
import { Injectable } from "@angular/core";

import { Event } from "@App/common/events/Event";

@Injectable()
export class EventBus {

  private events: Subject<Event>;

  constructor() {
    this.events = new Subject<Event>();
  }

  public publish(gameId: string, eventType: string, data: any = null): void {
    this.events.next({ gameId: gameId, eventType: eventType, data: data } as Event);
  }

  public publish2(message: Event): void {
    this.events.next(message);
  }

  public of(messageType: string = null): Observable<Event> {
    return messageType ? this.events.pipe(filter(m => m.eventType === messageType)) : this.events;
  }

}
