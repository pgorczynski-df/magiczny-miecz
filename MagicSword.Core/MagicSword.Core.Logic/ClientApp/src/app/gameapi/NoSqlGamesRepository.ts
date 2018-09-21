import * as mongoose from "mongoose";
import { Model } from "mongoose";

import { Services } from "@App/Services";
import { IGamesRepository } from "@App/common/repository/IGamesRepository";
import { GameListDto } from "@App/common/dto/GameListDto";
import { GameSchema } from "@App/gameapi/GameSchema";

const Game = mongoose.model('Game', GameSchema) as Model;

export class NoSqlGamesRepository implements IGamesRepository {

    constructor(private services: Services) {
    }

    public getGame(id: string): Promise<any> {
        return Game.findById(id).exec().then(g => g.data);
    }

    public save(dto: any): Promise<any> {
        this.services.logger.debug("Attepting to save game");
        this.services.logger.debug(dto);

        let newGame = new Game({ data: dto });
        return newGame.save().then(g => { return g.id; });
    }

    public update(id: string, dto: any): Promise<string> {
        this.services.logger.debug("Attepting to update game");
        this.services.logger.debug(dto);

        return Game.findByIdAndUpdate(id, { data: dto }).exec();
    }

    public getMyGames(): Promise<GameListDto[]> {
        return Game.find({}).exec().then(collection => {
            var res = [];
            for (var game of collection) {
                res.push(this.createListDto(game));
            }
            return res;
        });
    }

    public getOpenGames(): Promise<GameListDto[]> {
        return this.getMyGames();
    }

    public createGame(): Promise<GameListDto> {
        return this.save(null).then(r => this.createListDto(r));
    }

    private createListDto(game: any): GameListDto {
        var dto = new GameListDto();
        dto.id = game.id;
        return dto;
    }
}
