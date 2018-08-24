import { Services } from "@App/Services";
import { GamesApiClient } from "@App/common/client/GamesApiClient";
import { Serializer } from "@App/common/mechanics/Serializer";
import { Player } from "@App/common/mechanics/Player";
import { Game } from "@App/common/mechanics/Game";

export class GameProvider {

    private serializer = new Serializer();

    private cache = {};
    private dto = {};

    getGame(services: Services, id: string, callingPlayerId: string): Promise<any> {

        //TODO check if player is on the list

        var game = this.cache[id];
        if (!game) {
            services.logger.debug(`Cache did not contain game id = ${id}`);
            var gamesApiClient = new GamesApiClient(services);
            return gamesApiClient.get(id).then(
                gameDto => {

                    services.logger.debug(`Fetching game id = ${id} completed`);
                    services.logger.debug(gameDto);

                    game = this.createGame(services, callingPlayerId);

                    if (!gameDto) {
                        game.init();
                        gameDto = this.serializer.serializeGame(game);
                        gamesApiClient.save(gameDto).then(newId => {
                            game.id = newId;
                        });
                    } else {
                        game = this.serializer.deserializeGame(game, gameDto);
                    }

                    this.cache[id] = game;
                    return game;
                });
        }

        services.logger.debug(`Found game id = ${id} in cache`);
        return Promise.resolve(game);
    }

    getDto(services: Services, id: string, callingPlayerId: string): Promise<any> {
        return this.getGame(services, id, callingPlayerId).then(game => {
            return this.serializer.serializeGame(game);
        });;
    }

    private createGame(services: Services, ownerId: string): Game {
        services.logger.info(`Creating new game, ownerId = ${ownerId}`);
        var owner = new Player();
        owner.id = owner.name = ownerId;
        return new Game(owner);
    }
}
