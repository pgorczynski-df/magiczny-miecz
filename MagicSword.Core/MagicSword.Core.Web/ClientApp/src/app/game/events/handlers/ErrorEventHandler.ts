import { Event } from "@Common/events/Event";
import { EventType } from "@Common/events/EventType";
import { ClientEventHandlerBase } from "@App/game/events/ClientEventHandlerBase";
import { StringUtils } from "@Common/utils/StringUtils";

export class ErrorEventHandler extends ClientEventHandlerBase {

    getEventType(): string {
        return EventType.Error;
    }

    getMessage(event: Event): string {
        return StringUtils.format(this.r(), event.data);
    }
}

