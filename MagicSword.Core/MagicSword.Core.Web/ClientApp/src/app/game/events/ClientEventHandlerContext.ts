import { Services } from "@App/Services";
import { Game } from "@App/game/Game";
import { ClientSerializer } from "@App/game/ClientSerializer";

export class ClientEventHandlerContext {

    services: Services;

    game: Game;

    serializer = new ClientSerializer();

}
