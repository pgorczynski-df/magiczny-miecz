import { Event } from "@App/common/events/Event";
import { ViewStackRequestDto } from "@App/common/events/viewstack/ViewStackRequestDto";
import { CardStack } from "@App/game/logic/CardStack";
import { CardStackDto } from "@App/common/dto/CardStackDto";
import { EventType } from "@App/common/events/EventType";
import { ClientEventHandlerBase } from "@App/game/events/ClientEventHandlerBase";

export class ViewStackClientEventHandler extends ClientEventHandlerBase {

    private stack: CardStack;
    private resolve: any;

    getEventType(): string {
        return EventType.ViewStack;
    }

    viewCards(stack: CardStack): Promise<CardStack> {
        this.stack = stack;
        var dto = new ViewStackRequestDto();
        dto.stackId = stack.id;
        this.sendRequest(dto);

        return new Promise<CardStack>(resolve => this.resolve = resolve);
    }

    processResponse(event: Event): void {
        var dto = event.data as CardStackDto;
        this.context.serializer.deserializeCardCollection(null, this.stack, dto.cards, this.stack.cards, false);

        this.resolve(this.stack);
    }

    processNotification(event: Event) {



        //context.services.logger.info(`Gracz ${senderName} wyciągnał kartę ${card2.name}`);

    }

}

