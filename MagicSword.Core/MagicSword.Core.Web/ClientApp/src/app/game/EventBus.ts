import { Observable, Subject } from "rxjs/Rx";
import { Injectable } from "@angular/core";

import { Event } from "./Event";

@Injectable()
export class EventBus {

  private events: Subject<Event>;

  constructor() {
    this.events = new Subject<Event>();
  }

  public publish(message: Event): void {
    this.events.next(message);
  }

  public of(messageType: string = null): Observable<Event> {
    return messageType ? this.events.filter(m => m.type === messageType) : this.events;
  }

}
