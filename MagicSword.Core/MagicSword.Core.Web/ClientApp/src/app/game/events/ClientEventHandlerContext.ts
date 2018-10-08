import { Game } from "@App/game/Game";
import { ClientSerializer } from "@App/game/ClientSerializer";
import { ClientServices } from "@App/ClientServices";

export class ClientEventHandlerContext {

    services: ClientServices;

    game: Game;

    serializer = new ClientSerializer();

}
