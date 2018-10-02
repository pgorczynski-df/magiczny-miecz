import { Services } from "@App/Services";
import { HttpClient } from "@Common/client/HttpClient";
import { GameListDto } from "@Common/dto/GameListDto";

export class GamesApiClient extends HttpClient {

    private readonly apiUrl = "/game";

    constructor(services: Services) {
        super(services, services.settings.gameServerUrl);
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
        var url = `${this.apiUrl}/CreateGame`;
        return this.post(url);
    }


}
