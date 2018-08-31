import { Event } from "@App/common/events/Event";
import { EventType } from "@App/common/events/EventType";
import { GameStateDto } from "@App/common/dto/GameStateDto";
import { EventHandlerContext } from "@App/common/events/EventHandlerContext";
import { IServerEventHandler } from "@App/common/events/IServerEventHandler";
import { EventKind } from "@App/common/events/EventKind";

export class JoinGameServerEventHandler implements IServerEventHandler {

    getEventType(): string {
        return EventType.JoinGame;
    }

    process(context: EventHandlerContext, event: Event) {

        context.responseProcessor.registerCaller(event);

        context.gameProvider.getOrLoadDto(context.services, event.gameId, event.sourcePlayerId).then(gameDto => {

            var gsDto: GameStateDto = {
                currentPlayerId: event.sourcePlayerId,
                data: gameDto,
            } as any;

            context.responseProcessor.respondCaller({
                eventType: EventType.JoinGameResponse,
                sourcePlayerId: event.sourcePlayerId,
                eventKind: EventKind.Response,
                data: gsDto,
                gameId: event.gameId
            });

            context.responseProcessor.respondAll(
                {
                    gameId: event.gameId,
                    eventType: EventType.PlayerJoined,
                    eventKind: EventKind.Notification,
                    sourcePlayerId: event.sourcePlayerId,
                    data: {
                        id: event.sourcePlayerId,
                        name: event.sourcePlayerId,
                    }
                });

        });

    }

}
