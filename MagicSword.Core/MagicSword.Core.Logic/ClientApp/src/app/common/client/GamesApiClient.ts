import { Services } from "@App/Services";
import { HttpClient } from "@App/common/client/HttpClient";
import { IGamesRepository } from "@App/common/repository/IGamesRepository";
import { GameListDto } from "@App/common/dto/GameListDto";

export class GamesApiClient extends HttpClient implements IGamesRepository {

    private readonly apiUrl = "/game";

    constructor(services: Services) {
        super(services, services.settings.gameServerUrl);
    }

    public getGame(id: string): Promise<any> {
        var url = `${this.apiUrl}/${id}`;
        return this.get(url);
    }

    public save(dto: any): Promise<any> {
        var url = `${this.apiUrl}`;
        return this.post(url, { "data": JSON.stringify(dto) });
    }

    public update(id: string, dto: any): Promise<string> {
        var url = `${this.apiUrl}/${id}`;
        return this.patch<string>(url, { "data": JSON.stringify(dto) });
    }

    public getMyGames(): Promise<GameListDto[]> {
        var url = `${this.apiUrl}/MyGames`;
        return this.get<GameListDto[]>(url);
    }

    public getOpenGames(): Promise<GameListDto[]> {
        var url = `${this.apiUrl}/OpenGames`;
        return this.get<GameListDto[]>(url);
    }

    public createGame(): Promise<GameListDto> {
        var url = `${this.apiUrl}`;
        return this.post(url);
    }


}
