import * as mongoose from "mongoose";
import { Model } from "mongoose";

import { Services } from "@App/Services";
import { IGamesRepository } from "@Common/repository/IGamesRepository";
import { GameListDto } from "@Common/dto/GameListDto";
import { GameSchema } from "@App/gameapi/GameSchema";
import { UserDto } from "@Common/client/UserDto";

const Game = mongoose.model('Game', GameSchema) as Model;

export class NoSqlGamesRepository implements IGamesRepository {

    constructor(private services: Services) {
    }

    public getGame(id: string): Promise<any> {
        return Game.findById(id).exec().then(g => g.data);
    }

    public createGame(owner: UserDto): Promise<GameListDto> {
        return this.saveInternal(owner, null).then(r => this.createListDto(r));
    }

    public save(owner: UserDto, dto: any): Promise<any> {
        return this.saveInternal(owner, dto).then(g => { return g.id; });
    }

    private saveInternal(owner: UserDto, dto: any): Promise<any> {
        this.services.logger.debug("Attepting to save game");
        this.services.logger.debug(dto);

        let newGame = new Game({
            data: dto,
            ownerId: owner.id,
            ownerName: owner.nickname,
            createdOn: Date.now(),
            updatedOn: Date.now(),
        });
        return newGame.save();
    }

    public update(id: string, dto: any): Promise<string> {
        this.services.logger.debug("Attepting to update game");
        this.services.logger.debug(dto);

        return Game.findByIdAndUpdate(id,
            {
                data: dto,
                updatedOn: Date.now(),
            }).exec();
    }

    public getUserGames(userId: string): Promise<GameListDto[]> {
        return Game.find({ ownerId: userId}).exec().then(collection => {
            var res = this.createDtoList(collection);
            return res;
        });
    }

    public getOpenGames(): Promise<GameListDto[]> {
        return Game.find({}).exec().then(collection => {
            var res = this.createDtoList(collection);
            return res;
        });
    }

    private createDtoList(collection: any): GameListDto[] {
        var res = [];
        for (var game of collection) {
            res.push(this.createListDto(game));
        }
        return res;
    }

    private createListDto(game: any): GameListDto {
        var dto = new GameListDto();
        dto.id = game.id;
        dto.ownerName = game.ownerName;
        dto.createdOn = game.createdOn;
        dto.updatedOn = game.updatedOn;
        return dto;
    }
}
