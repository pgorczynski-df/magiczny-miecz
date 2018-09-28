import { Services } from "@App/Services";
import { CommonSerializer } from "@App/common/mechanics/CommonSerializer";
import { Player } from "@App/common/mechanics/Player";
import { Game } from "@App/common/mechanics/Game";
import { GameDto } from "@App/common/dto/GameDto";
import { IGamesRepository } from "@App/common/repository/IGamesRepository";

export class GameProvider {

    private cache: { [gameId: string]: Game } = {};

    constructor(private serializer: CommonSerializer, private repositoryFactory: (services: Services) => IGamesRepository) {
    }

    getOrLoadGame(services: Services, id: string): Promise<Game> {
        var game = this.getGame(id);
        if (!game) {
            services.logger.debug(`Cache did not contain game id = ${id}`);
            var repository = this.repositoryFactory(services);
            return repository.getGame(id).then(
                (gameDto: GameDto) => {

                    services.logger.debug(`Fetching game id = ${id} completed`);
                    services.logger.debug(gameDto);

                    game = new Game();
                    game.id = id;

                    if (!gameDto || !gameDto.players) {

                        services.logger.debug(`Game id = ${id} didn't contain data, creating new game`);
                        game.init();
                        this.persistGame(services, game);

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

    persistGame(services: Services, game: Game): GameDto {
        var gameDto = this.serializer.serializeGame(game);
        var repository = this.repositoryFactory(services);
        repository.update(game.id, gameDto).then(resId => {
            services.logger.debug(`Game id = ${resId} updated successfully`);
        });
        return gameDto;
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

    evictCache() {
        this.cache = {};
    }

}
