import { Services } from "@App/Services";
import { GamesApiClient } from "@App/common/client/GamesApiClient";
import { CommonSerializer } from "@App/common/mechanics/CommonSerializer";
import { Player } from "@App/common/mechanics/Player";
import { Game } from "@App/common/mechanics/Game";

export class GameProvider {

    private serializer = new CommonSerializer();

    private cache = {};
    //private dto = {};

    getOrLoadGame(services: Services, id: string, callingPlayerId: string): Promise<any> {

        //TODO check if player is on the list

        var game = this.getGame(id);
        if (!game) {
            services.logger.debug(`Cache did not contain game id = ${id}`);
            var gamesApiClient = new GamesApiClient(services);
            return gamesApiClient.get(id).then(
                gameDto => {

                    services.logger.debug(`Fetching game id = ${id} completed`);
                    services.logger.debug(gameDto);

                    game = this.createGame(services, callingPlayerId);

                    if (!gameDto) {

                        services.logger.debug(`Game id = ${id} didn't contain data, creating new game`);

                        game.init();
                        gameDto = this.serializer.serializeGame(game);
                        gamesApiClient.update(id, gameDto).then(resId => {
                            services.logger.debug(`Game id = ${resId} initiated successfully`);
                        });
                    } else {

                        services.logger.debug(`Game id = ${id} existed, deserializing`);
                        this.serializer.deserializeGame(gameDto, game);
                    }

                    services.logger.debug(`Adding game id = ${id} to cache`);

                    this.cache[id] = game;
                    return game;
                });
        }

        services.logger.debug(`Found game id = ${id} in cache`);
        return Promise.resolve(game);
    }

    getOrLoadDto(services: Services, id: string, callingPlayerId: string): Promise<any> {
        return this.getOrLoadGame(services, id, callingPlayerId).then(game => {
            return this.serializer.serializeGame(game);
        });;
    }

    getGame(id: string): Game {
        var game = this.cache[id] as Game;
        if (!game) {
            return null;
        }
        return game;
    }

    getDto(id: string) {
        var game = this.getGame(id);
        if (!game) {
            return null;
        }
        return this.serializer.serializeGame(game);
    }

    private createGame(services: Services, ownerId: string): Game {
        services.logger.info(`Creating new game, ownerId = ${ownerId}`);
        var owner = new Player();
        owner.id = owner.name = ownerId;
        var game = new Game(owner);
        return game;
    }
}
