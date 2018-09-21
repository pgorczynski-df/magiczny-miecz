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
        return Game.findById(id).exec();
    }

    public save(dto: any): Promise<any> {
        let newGame = new Game({ data: dto });
        return newGame.save().exec().then(g => { return g.id; });
    }

    public update(id: string, dto: any): Promise<string> {
        return Game.findByIdAndUpdate(id, { data: dto }).exec();
    }

    public getMyGames(): Promise<GameListDto[]> {
        return Game.find({}).exec().then(collection => {
            var res = [];
            for (var game of collection) {
                res.push(this.createDto(game));
            }
            return res;
        });
    }

    public getOpenGames(): Promise<GameListDto[]> {
        return this.getMyGames();
    }

    public createGame(): Promise<GameListDto> {
        return this.save(null).then(r => this.createDto(r));
    }

    private createDto(game: any): GameListDto {
        var dto = new GameListDto();
        dto.id = game.id;
        return dto;
    }
}
