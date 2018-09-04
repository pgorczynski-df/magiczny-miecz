import { Services } from "@App/Services";
import { HttpClient } from "@App/common/client/HttpClient";
import { IGamesRepository } from "@App/common/repository/IGamesRepository";

export class GamesApiClient extends HttpClient implements IGamesRepository {

    private readonly apiUrl = "/api/Games";

    constructor(services: Services) {
        super(services, services.settings.authServerUrl);
    }

    public get(id: string): Promise<any> {
        var url = `${this.apiUrl}/${id}`;
        return super.get(url);
    }

    public save(dto: any): Promise<any> {
        var url = `${this.apiUrl}`;
        return super.post(url, { "data": JSON.stringify(dto) });
    }

    public update(id: string, dto: any): Promise<any> {
        var url = `${this.apiUrl}/${id}`;
        return super.patch(url, { "data": JSON.stringify(dto) });
    }

    public getMyGames(): Promise<any> {
        var url = `${this.apiUrl}/MyGames`;
        return super.get(url);
    }

    public getOpenGames(): Promise<any> {
        var url = `${this.apiUrl}/OpenGames`;
        return super.get(url);
    }

    public createGame(): Promise<any> {
        var url = `${this.apiUrl}/CreateGame`;
        return super.post(url);
    }


}
