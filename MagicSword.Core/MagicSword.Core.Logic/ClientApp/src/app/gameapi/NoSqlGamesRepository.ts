import { Services } from "@Common/infrastructure/Services";
import { IGamesRepository } from "@Common/repository/IGamesRepository";
import { GameListDto } from "@Common/dto/GameListDto";
import { UserDto } from "@Common/client/UserDto";
import { GameVisibility } from "@Common/model/GameVisibility";
import { DbGame } from "@App/gameapi/DbGame";

const Game = new DbGame().getModelForClass(DbGame);

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
            visibility: GameVisibility.Public,
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
        dto.id = (game as any).id; //impicit property from mongo
        dto.ownerName = game.ownerName;
        dto.createdOn = game.createdOn;
        dto.updatedOn = game.updatedOn;
        dto.visibility = game.visibility;
        return dto;
    }
}
