import { Event } from "@App/common/events/Event";
import { EventType } from "@App/common/events/EventType";
import { ClientEventHandlerBase } from "@App/game/events/ClientEventHandlerBase";
import { StringUtils } from "@App/common/utils/StringUtils";

export class DiceThrowClientEventHandler extends ClientEventHandlerBase {

    getEventType(): string {
        return EventType.DiceThrow;
    }

    throwDice() {
        this.sendRequest({ });
    }

    processNotification(event: Event) {
        var result = event.data;
        var game = this.context.game;
        game.throwDice(result);
    }

    getMessage(event: Event): string {
        var result = event.data;
        return StringUtils.format(this.r(), this.senderName(event), result);
    }

}

