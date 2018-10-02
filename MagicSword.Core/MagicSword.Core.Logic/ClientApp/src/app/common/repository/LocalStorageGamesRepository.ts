import { IGamesRepository } from "@Common/repository/IGamesRepository";
import { Services } from "@App/Services";
import { GameListDto } from "@Common/dto/GameListDto";

export class LocalStorageGamesRepository implements IGamesRepository {

    private readonly key = "mmsave";

    constructor(private services: Services) {
    }

    getMyGames(): Promise<GameListDto[]> {
        throw new Error("not supported");
    }

    getGame(id: string): Promise<any> {
        var games = this.getUserGames();
        if (!games) {
            return Promise.resolve(null);
        }
        return Promise.resolve(games[id]);
    }

    update(id: string, dto: any): Promise<any> {
        var repo = this.getRepo();
        var games = this.getUserGames(repo);
        games[id] = dto;
        this.saveRepo(repo);
        return Promise.resolve(id);
    }

    save(ownerId: string, dto: any): Promise<any> {
        throw new Error("not supported");
    }

    createGame(ownerId: string): Promise<GameListDto> {
        throw new Error("not supported");
    }

    private getUserGames(repo = null) {
        if (repo === null) {
            repo = this.getRepo();
        }
        var games = repo[this.services.authService.token];
        if (!games) {
            games = {};
            repo[this.services.authService.token] = games;
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
