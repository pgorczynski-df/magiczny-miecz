import axios from "axios";
import {IGamesRepository as IGameRepository} from "./IGamesRepository";
import {Services} from "../../Services";

export class GamesApiClient implements IGameRepository {

    private server = "http://localhost:53048";

    constructor(private services: Services) {
    }

    public get(id: string): Promise<any> {
        var url = `${this.server}/api/Games/${id}`;
        this.services.logger.debug(`Attempting to GET ${url}`);
        return axios.get<any>(url, this.getConfig()).then(r => {
            this.services.logger.debug(`GET ${url} successful`);
            return r.data;
        });
    }

    private getConfig() {
        return { headers: { "Authorization": `Bearer ${this.services.authService.token}` } };
    }

}