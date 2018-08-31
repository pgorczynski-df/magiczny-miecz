import { Event } from "@App/common/events/Event";
import { EventType } from "@App/common/events/EventType";
import { ClientEventHandlerBase } from "@App/game/events/ClientEventHandlerBase";
import { GameStateDto } from "@App/common/dto/GameStateDto";

export class JoinGameEventHandler extends ClientEventHandlerBase {

    getEventType(): string {
        return EventType.JoinGame;
    }

    request() {
        this.sendRequest({});
    }

    processResponse(event: Event) {

        var game = this.context.game;

        var rdto = event.data as GameStateDto;
        game.currentPlayerId = rdto.currentPlayerId;

        var gameDto = rdto.data;
        this.context.serializer.deserializeGame(gameDto, game);

    }

    processNotification(event: Event): void {

        var game = this.context.game;

        var playerId = event.data.id;
        var player = game.findPlayer(playerId);
        if (!player) {
            game.players.push(event.data);
        }

        //this.services.logger.info(`Gracz ${ev.data.name} dołącza do gry`);
    }
}

