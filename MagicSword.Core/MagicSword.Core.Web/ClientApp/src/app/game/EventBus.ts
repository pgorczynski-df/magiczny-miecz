import { Observable, Subject } from "rxjs";
import { filter } from "rxjs/operators";
import { Injectable } from "@angular/core";

import { Event } from "@Common/events/Event";
import { Guid } from "@Common/utils/Guid";

@Injectable()
export class EventBus {

    private events: Subject<Event>;

    constructor() {
        this.events = new Subject<Event>();
    }

    public publish(gameId: string, eventType: string, eventKind: string, data: any = null): void {
        this.events.next({
            id: Guid.uuidv4(),
            gameId: gameId,
            eventType: eventType,
            eventKind: eventKind,
            data: data
        } as Event);
    }

    public publish2(message: Event): void {
        this.events.next(message);
    }

    public of(messageType: string = null): Observable<Event> {
        return messageType ? this.events.pipe(filter(m => m.eventType === messageType)) : this.events;
    }

}
