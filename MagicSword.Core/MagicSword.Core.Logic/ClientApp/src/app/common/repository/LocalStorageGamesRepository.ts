import { IGamesRepository } from "@Common/repository/IGamesRepository";
import { Services } from "@Common/infrastructure/Services";
import { GameListDto } from "@Common/dto/GameListDto";
import { UserDto } from "@Common/client/UserDto";

export class LocalStorageGamesRepository implements IGamesRepository {

    private readonly key = "mmsave";

    constructor(private services: Services) {
    }

    getUserGames(userId: string): Promise<GameListDto[]> {
        throw new Error("not supported");
    }

    getOpenGames(): Promise<GameListDto[]> {
        throw new Error("not supported");
    }

    getGame(id: string): Promise<any> {
        var games = this.getUsersGames();
        if (!games) {
            return Promise.resolve(null);
        }
        return Promise.resolve(games[id]);
    }

    update(id: string, dto: any): Promise<any> {
        var repo = this.getRepo();
        var games = this.getUsersGames(repo);
        games[id] = dto;
        this.saveRepo(repo);
        return Promise.resolve(id);
    }

    save(owner: UserDto, dto: any): Promise<any> {
        throw new Error("not supported");
    }

    createGame(owner: UserDto): Promise<GameListDto> {
        throw new Error("not supported");
    }

    private getUsersGames(repo = null) {
        if (repo === null) {
            repo = this.getRepo();
        }
        var games = repo["local_user"];
        if (!games) {
            games = {};
            repo["local_user"] = games;
        }
        return games;
    }

    private getRepo() {
        var jsString = localStorage.getItem(this.key);
        if (!jsString) {
            return {};
        }

        return JSON.parse(jsString);
    }

    private saveRepo(repo) {
        var jsString = JSON.stringify(repo);
        localStorage.setItem(this.key, jsString);
    }
}
