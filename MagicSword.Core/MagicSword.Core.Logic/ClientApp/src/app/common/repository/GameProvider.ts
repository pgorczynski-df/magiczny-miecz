import { Services } from "@Common/infrastructure/Services";
import { CommonSerializer } from "@Common/mechanics/CommonSerializer";
import { Player } from "@Common/mechanics/Player";
import { Game } from "@Common/mechanics/Game";
import { GameDto } from "@Common/dto/GameDto";
import { IGamesRepository } from "@Common/repository/IGamesRepository";

export class GameProvider {


    constructor(private serializer: CommonSerializer, private repositoryFactory: (services: Services) => IGamesRepository) {
    }

    async getOrLoadGame(services: Services, id: string): Promise<Game> {

        var repository = this.repositoryFactory(services);
        var dbGame = await repository.getGame(id);

        var gameDto: GameDto = dbGame.data;

        var game = new Game();
        game.id = id;

        if (!gameDto || !gameDto.players) {

            services.logger.debug(`Game id = ${id} didn't contain real data, creating new game`);
            game.init();
            this.persistGame(services, game);

        } else {

            services.logger.debug(`Game id = ${id} existed, deserializing`);
            this.serializer.deserializeGame(gameDto, game);
        }

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


}
