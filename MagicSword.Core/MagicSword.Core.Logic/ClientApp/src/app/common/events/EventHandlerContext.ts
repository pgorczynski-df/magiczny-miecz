import { IResponseProcessor } from "@App/common/events/IResponseProcessor";
import { Services } from "@App/Services";
import { GameProvider } from "@App/common/repository/GameProvider";
import { Game } from "@App/common/mechanics/Game";
import { Event } from "@App/common/events/Event";

export class EventHandlerContext {

    services: Services;

    responseProcessor: IResponseProcessor;

    gameProvider: GameProvider;

    game: Game;

    event: Event;
}
