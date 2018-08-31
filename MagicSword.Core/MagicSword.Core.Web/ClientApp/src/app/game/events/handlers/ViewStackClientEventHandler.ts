import { Event } from "@App/common/events/Event";
import { DrawCardNotificationDto } from "@App/common/events/drawcard/DrawCardNotificationDto";
import { CardStack } from "@App/game/logic/CardStack";
import { DrawCardRequestDto } from "@App/common/events/drawcard/DrawCardRequestDto";
import { EventType } from "@App/common/events/EventType";
import { ClientEventHandlerBase } from "@App/game/events/ClientEventHandlerBase";

export class ViewStackClientEventHandler extends ClientEventHandlerBase {

    getEventType(): string {
        return EventType.ViewStack;
    }

    viewCards(stack: CardStack) {
        this.sendRequest({});
    }

    processResponse(event: Event): void {

    }

    processNotification(event: Event) {



        //context.services.logger.info(`Gracz ${senderName} wyciągnał kartę ${card2.name}`);

    }

}

