import { EventType } from "@App/common/events/EventType";
import { GameStateDto } from "@App/common/dto/GameStateDto";
import { EventHandlerContext } from "@App/common/events/EventHandlerContext";
import { ServerEventHandlerBase } from "@App/common/events/ServerEventHandlerBase";

export class JoinGameServerEventHandler extends ServerEventHandlerBase {

    getEventType(): string {
        return EventType.JoinGame;
    }

    process(context: EventHandlerContext, data: any) {

        context.gameProvider.getOrLoadDto(context.services, context.game.id, context.event.sourcePlayerId).then(gameDto => {

            var gsDto: GameStateDto = {
                currentPlayerId: context.callingPlayer.id,
                data: gameDto,
            } as any;

            this.respondCaller(context, gsDto);

            this.notifyAll(context, {
                id: context.callingPlayer.id,
                name: context.callingPlayer.name,
            });

        });

    }

}
