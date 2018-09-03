import { Event } from "@App/common/events/Event";
import { EventType } from "@App/common/events/EventType";
import { ClientEventHandlerBase } from "@App/game/events/ClientEventHandlerBase";
import { StringUtils } from "@App/common/utils/StringUtils";

export class ErrorEventHandler extends ClientEventHandlerBase {

    getEventType(): string {
        return EventType.Error;
    }

    getMessage(event: Event): string {
        return StringUtils.format(this.r(), event.data);
    }
}

