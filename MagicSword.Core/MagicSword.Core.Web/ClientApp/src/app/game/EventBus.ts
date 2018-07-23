import { Observable, Subject } from "rxjs";
import { Injectable } from "@angular/core";

import { Event } from "./Event";

@Injectable()
export class EventBus {

  private events: Subject<Event>;

  constructor() {
    this.events = new Subject<Event>();
  }

  public publish(eventType: string, data: any = null): void {
    this.events.next({ eventType: eventType, data: data } as Event);
  }

  public publish2(message: Event): void {
    this.events.next(message);
  }

  public of(messageType: string = null): Observable<Event> {
    return messageType ? this.events.filter(m => m.eventType === messageType) : this.events;
  }

}
