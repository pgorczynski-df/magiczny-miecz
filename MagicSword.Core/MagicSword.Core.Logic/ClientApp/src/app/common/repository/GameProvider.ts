import { Services } from "@Common/infrastructure/Services";
import { CommonSerializer } from "@Common/mechanics/CommonSerializer";
import { Player } from "@Common/mechanics/Player";
import { Game } from "@Common/mechanics/Game";
import { GameDto } from "@Common/dto/GameDto";
import { IGamesRepository } from "@Common/repository/IGamesRepository";

export class GameProvider {

    private cache: { [gameId: string]: Game } = {};

    constructor(private serializer: CommonSerializer, private repositoryFactory: (services: Services) => IGamesRepository) {
    }

    async getOrLoadGame(services: Services, id: string): Promise<Game> {
        var game = this.getGame(id);

        if (game) {
            services.logger.debug(`Found game id = ${id} in cache`);
            return Promise.resolve(game);
        }

        services.logger.debug(`Cache did not contain game id = ${id}`);
        var repository = this.repositoryFactory(services);
        var dbGame = await repository.getGame(id);

        services.logger.debug(`Retrieved game id = ${id} from repository`);

        var gameDto: GameDto = dbGame.data;

        game = new Game();
        game.id = id;

        if (!gameDto || !gameDto.players) {

            services.logger.debug(`Game id = ${id} didn't contain real data, creating new game`);
            game.init();
            this.persistGame(services, game);

        } else {

            services.logger.debug(`Game id = ${id} existed, deserializing`);
            this.serializer.deserializeGame(gameDto, game);
        }

        services.logger.debug(`Adding game id = ${id} to cache`);

        this.cache[id] = game;
        return game;
    }

    persistGame(services: Services, game: Game): GameDto {
        var gameDto = this.serializer.serializeGame(game);
        var repository = this.repositoryFactory(services);
        repository.updateGameData(game.id, gameDto).then(resId => {
            services.logger.debug(`Game id = ${resId} updated successfully`);
        });
        return gameDto;
    }

    private getGame(id: string): Game {
        var game = this.cache[id] as Game;
        if (!game) {
            return null;
        }
        return game;
    }

    evictCache() {
        this.cache = {};
    }

}
