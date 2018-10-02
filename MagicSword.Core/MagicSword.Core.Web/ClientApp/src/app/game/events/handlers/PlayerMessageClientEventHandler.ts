import { Event } from "@Common/events/Event";
import { EventType } from "@Common/events/EventType";
import { ClientEventHandlerBase } from "@App/game/events/ClientEventHandlerBase";
import { StringUtils } from "@Common/utils/StringUtils";

export class PlayerMessageClientEventHandler extends ClientEventHandlerBase {

    getEventType(): string {
        return EventType.PlayerMessage;
    }

    sendMessage(msg: string) {
        this.sendRequest(msg);
    }

    getMessage(event: Event): string {
        var msg = event.data;
        return StringUtils.format(this.r(), this.senderName(event), msg);
    }

}

