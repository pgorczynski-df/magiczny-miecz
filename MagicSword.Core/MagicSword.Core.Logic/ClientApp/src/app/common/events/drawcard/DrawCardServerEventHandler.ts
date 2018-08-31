import { Event } from "@App/common/events/Event";
import { EventType } from "@App/common/events/EventType";
import { IResponseProcessor } from "@App/common/events/IResponseProcessor";
import { Services } from "@App/Services";
import { Game } from "@App/common/mechanics/Game";
import { GameProvider } from "@App/common/repository/GameProvider";
import { DrawCardRequestDto } from "@App/common/events/drawcard/DrawCardRequestDto";
import { DrawCardNotificationDto } from "@App/common/events/drawcard/DrawCardNotificationDto";
import { EventHandlerContext } from "@App/common/events/EventHandlerContext";
import { IServerEventHandler } from "@App/common/events/IServerEventHandler";
import {EventKind} from "@App/common/events/EventKind";

export class DrawCardServerEventHandler implements IServerEventHandler {

    getEventType(): string {
        return EventType.DrawCard;
    }

    process(context: EventHandlerContext, event: Event) {

        context.gameProvider.getOrLoadGame(context.services, event.gameId, event.sourcePlayerId).then(game => {

            var args = event.data as DrawCardRequestDto;
            var card = game.world.drawCard(args.stackId, args.uncover);
            var cardDto = context.gameProvider.serializer.serializeCard(card);
            var res = new DrawCardNotificationDto();
            res.cardDto = cardDto;

            //this.responseProcessor.respondCaller({
            //    eventType: EventType.JoinGameResponse,
            //    data: res,
            //    gameId: event.gameId
            //});

            context.gameProvider.persistGame(context.services, game);

            context.responseProcessor.respondAll(
                {
                    gameId: event.gameId,
                    eventType: EventType.DrawCard,
                    eventKind: EventKind.Notification,
                    sourcePlayerId: event.sourcePlayerId,
                    data: res,
                });

        });

    }

}
