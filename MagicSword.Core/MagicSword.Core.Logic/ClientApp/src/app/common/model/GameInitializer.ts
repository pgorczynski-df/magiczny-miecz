import { Services } from "@Common/infrastructure/Services";
import { UserDto } from "@Common/client/UserDto";
import { Game } from "@Common/mechanics/Game";
import { IGamesRepository } from "@Common/repository/IGamesRepository";
import { CommonSerializer } from "@Common/mechanics/CommonSerializer";


export class GameInitializer {

    private commonSerializer = new CommonSerializer();

    constructor(private services: Services, private repository: IGamesRepository) {
    }

    async initGame(gameId: string, owner: UserDto) {

        this.services.logger.debug(`Creating new game id = ${gameId}`);

        var game = new Game();
        game.id = gameId;
        game.init();
        game.addPlayer(owner.id, owner.nickname);

        var gameDto = this.commonSerializer.serializeGame(game);

        await this.repository.updateGameData(game.id, gameDto);

        this.services.logger.debug(`Game id = ${gameId} created successfully`);
    }
}
