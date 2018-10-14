import { Services } from "@Common/infrastructure/Services";
import { IGamesRepository } from "@Common/repository/IGamesRepository";
import { GameListDto } from "@Common/dto/GameListDto";
import { UserDto } from "@Common/client/UserDto";
import { GameVisibility } from "@Common/model/GameVisibility";
import { DbGame } from "@App/gameapi/DbGame";
import { GameDto } from "@Common/dto/GameDto";
import { IDbGame } from "@Common/repository/IDbGame";

const Game = new DbGame().getModelForClass(DbGame);

export class NoSqlGamesRepository implements IGamesRepository {

    private cache: { [gameId: string]: IDbGame } = {};

    constructor(private services: Services) {
    }

    public getGame(id: string): Promise<IDbGame> {

        var game = this.cache[id] as IDbGame;

        if (game) {
            this.services.logger.debug(`Game id = ${id} returned from cache`);
            return Promise.resolve(game);
        }

        game = Game.findById(id).exec();
        this.services.logger.debug(`Game id = ${id} fetched from repository and cached`);

        //TODO there's something wrong with this cache - investigate
        //this.cache[id] = game; 

        return Promise.resolve(game);
    }

    evictCache() {
        this.cache = {};
    }

    public createGame(owner: UserDto): Promise<GameListDto> {
        return this.saveInternal(owner, null).then(r => this.createListDto(r));
    }

    private saveInternal(owner: UserDto, dto: GameDto): Promise<any> {
        this.services.logger.debug("Attepting to save game");

        let newGame = new Game({
            data: dto,
            ownerId: owner.id,
            ownerName: owner.nickname,
            createdOn: Date.now(),
            updatedOn: Date.now(),
            visibility: GameVisibility.Public,
        });
        return newGame.save();
    }

    public updateGameData(id: string, dto: GameDto): Promise<string> {
        this.services.logger.debug("Attepting to update game " + id);

        return Game.findByIdAndUpdate(id,
            {
                data: dto,
                updatedOn: Date.now(),
            })
            .exec()
            .then(g => g.id);
    }

    public updateMetadata(id: string, dto: GameListDto): Promise<string> {
        this.services.logger.debug("Attepting to update metadata of game " + id);

        if (GameVisibility.all.indexOf(dto.visibility) < 0) {
            throw new Error(`Invalid visibility value: ${dto.visibility}`);
        }

        return Game.findByIdAndUpdate(id,
            {
                visibility: dto.visibility,
            })
            .exec()
            .then(g => g.id);
    }

    public delete(id: string): Promise<string> {
        this.services.logger.debug("Attepting to delete game " + id);

        if (this.cache[id]) {
            this.cache[id] = null;
        }

        return Game.findByIdAndDelete(id).exec().then(g => g.id);
    }

    public getUserGames(userId: string): Promise<GameListDto[]> {
        return Game.find({ ownerId: userId }).exec().then(collection => {
            var res = this.createDtoList(collection);
            return res;
        });
    }

    public getPublicGames(): Promise<GameListDto[]> {
        return Game.find({ visibility: GameVisibility.Public }).exec().then(collection => {
            var res = this.createDtoList(collection);
            return res;
        });
    }

    private createDtoList(collection: DbGame[]): GameListDto[] {
        var res = [];
        for (var game of collection) {
            res.push(this.createListDto(game));
        }
        return res;
    }

    private createListDto(game: DbGame): GameListDto {
        var dto = new GameListDto();
        dto.id = (game as any).id; //implicit property from mongo
        dto.ownerName = game.ownerName;
        dto.createdOn = game.createdOn;
        dto.updatedOn = game.updatedOn;
        dto.visibility = game.visibility;
        return dto;
    }
}
