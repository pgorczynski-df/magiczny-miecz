import { Event } from "@App/common/events/Event";
import { EventType } from "@App/common/events/EventType";
import { GameStateDto } from "@App/common/dto/GameStateDto";
import { EventHandlerContext } from "@App/common/events/EventHandlerContext";
import { IServerEventHandler } from "@App/common/events/IServerEventHandler";

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
                isStarted: true, // gameDto != null,
            };

            context.responseProcessor.respondCaller({
                eventType: EventType.JoinGameResponse,
                sourcePlayerId: event.sourcePlayerId,
                data: gsDto,
                gameId: event.gameId
            });

            context.responseProcessor.respondAll(
                {
                    gameId: event.gameId,
                    eventType: EventType.PlayerJoined,
                    sourcePlayerId: event.sourcePlayerId,
                    data: {
                        id: event.sourcePlayerId,
                        name: event.sourcePlayerId,
                    }
                });

        });

    }

}
