import { IResponseProcessor } from "@App/common/events/IResponseProcessor";
import { Services } from "@App/Services";
import { GameProvider } from "@App/common/repository/GameProvider";
import { Game } from "@App/common/mechanics/Game";
import { Event } from "@App/common/events/Event";
import { CommonSerializer } from "@App/common/mechanics/CommonSerializer";
import { Player } from "@App/common/mechanics/Player";

export class EventHandlerContext {

    serializer: CommonSerializer;

    services: Services;

    responseProcessor: IResponseProcessor;

    gameProvider: GameProvider;

    game: Game;

    event: Event;

    callingPlayer: Player;
}
