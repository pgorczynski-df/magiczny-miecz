import { Event } from "@App/common/events/Event";
import { ViewStackRequestDto } from "@App/common/events/viewstack/ViewStackRequestDto";
import { CardStack } from "@App/game/logic/CardStack";
import { EventType } from "@App/common/events/EventType";
import { ClientEventHandlerBase } from "@App/game/events/ClientEventHandlerBase";
import { StringUtils } from "@App/common/utils/StringUtils";
import { Card } from "@App/game/logic/Card";
import { CardDto } from "@App/common/dto/CardDto";

export class ViewStackClientEventHandler extends ClientEventHandlerBase {

    private stack: CardStack;
    private resolve: any;

    getEventType(): string {
        return EventType.ViewStack;
    }

    viewCards(stack: CardStack): Promise<Card[]> {
        return this.viewCardsInternal(stack, ViewStackRequestDto.cards);
    }

    viewDisposedCards(stack: CardStack): Promise<Card[]> {
        return this.viewCardsInternal(stack, ViewStackRequestDto.disposedCards);
    }

    private viewCardsInternal(stack: CardStack, subStack: string): Promise<Card[]> {
        this.stack = stack;
        var dto = new ViewStackRequestDto();
        dto.stackId = stack.id;
        dto.subStack = subStack;
        this.sendRequest(dto);

        return new Promise<Card[]>(resolve => this.resolve = resolve);
    }

    processResponse(event: Event): void {
        var dto = event.data as CardDto[];

        var cards: Card[] = [];
        this.context.serializer.deserializeCardCollection(null, this.stack, dto, cards, false);

        this.resolve(cards);
    }

    getMessage(event: Event): string {
        var dto = event.data as ViewStackRequestDto;
        var stack = this.context.game.findActor(dto.stackId) as CardStack;
        if (stack) {
            return StringUtils.format(this.r(), this.senderName(event), this.res(dto.subStack), stack.name);
        } else {
            return event.eventType + " " + "error";
        }
    }

}

