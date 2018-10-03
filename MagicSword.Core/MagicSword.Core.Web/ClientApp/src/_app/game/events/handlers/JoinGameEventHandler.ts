import { Event } from "@Common/events/Event";
import { EventType } from "@Common/events/EventType";
import { ClientEventHandlerBase } from "@App/game/events/ClientEventHandlerBase";
import { GameDto } from "@Common/dto/GameDto";
import { GameStateDto } from "@Common/dto/GameStateDto";
import { StringUtils } from "@Common/utils/StringUtils";

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

        var gameDto = rdto.data as GameDto;
        this.context.serializer.deserializeGame(gameDto, game);

    }

    processNotification(event: Event): void {

        var game = this.context.game;

        var playerId = event.data.id;
        var player = game.findPlayer(playerId);
        if (!player) {
            game.players.push(event.data);
        }
    }

    getMessage(event: Event): string {
        return StringUtils.format(this.r(), this.senderName(event));
    }
}

