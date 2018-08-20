import { Services } from "@App/Services";
import { HttpClient } from "@App/common/client/HttpClient";

export class GamesApiClient extends HttpClient {

    private readonly apiUrl = "/api/Games";

    constructor(services: Services) {
        super(services.settings.authServerUrl, services);
    }

    public get(id: string): Promise<any> {
        var url = `${this.apiUrl}/${id}`;
        return super.get(url);
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
