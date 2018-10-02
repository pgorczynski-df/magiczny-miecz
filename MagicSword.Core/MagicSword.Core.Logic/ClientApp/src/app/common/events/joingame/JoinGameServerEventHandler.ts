import { EventType } from "@Common/events/EventType";
import { GameStateDto } from "@Common/dto/GameStateDto";
import { EventHandlerContext } from "@Common/events/EventHandlerContext";
import { ServerEventHandlerBase } from "@Common/events/ServerEventHandlerBase";
import { EventKind } from "@Common/events/EventKind";

export class JoinGameServerEventHandler extends ServerEventHandlerBase {

    private readonly lastEventsToLoad = 20; 

    getEventType(): string {
        return EventType.JoinGame;
    }

    process(context: EventHandlerContext, data: any) {

        var playerId = context.callingPlayer.id;
        var game = context.game;
        var gameDto = context.serializer.serializeGameForPlayer(game, playerId);

        var gsDto = {
            currentPlayerId: playerId,
            data: gameDto,
            notificationEvents: []
        } as GameStateDto;

        var playerEvents = context.callingPlayer.outboundEventIds;

        var beginIndex = playerEvents.length - this.lastEventsToLoad;
        var sliced = playerEvents.slice(beginIndex > 0 ? beginIndex : 0, playerEvents.length);

        for (var eventId of sliced) {
            var event = game.outBoundEvents.find(e => e.id === eventId); //TODO optimize
            if (event && event.eventKind === EventKind.Notification) {               
                gsDto.notificationEvents.push(event);
            }
        }

        this.respondCaller(context, gsDto);

        this.notifyAll(context, {
            id: context.callingPlayer.id,
            name: context.callingPlayer.name,
        });

    }

}
