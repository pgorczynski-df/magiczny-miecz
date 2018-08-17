﻿import axios from "axios";
import { AxiosRequestConfig } from "axios";
import { IGamesRepository } from "./IGamesRepository";
import { Services } from "../../Services";

export class GamesApiClient implements IGamesRepository {

    private server = "http://localhost:53048";

    constructor(private services: Services) {
    }

    public get(id: string): Promise<any> {
        var url = `${this.server}/api/Games/${id}`;
        return this.request("GET", url);
    }

    public getMyGames(): Promise<any> {
        var url = `${this.server}/api/Games/MyGames`;
        return this.request("GET", url);
    }

    public getOpenGames(): Promise<any> {
        var url = `${this.server}/api/Games/OpenGames`;
        return this.request("GET", url);
    }

    private request(method: string, url: string) {
        this.services.logger.debug(`Attempting to ${method} ${url}`);
        return axios.request<any>(this.getConfig(method, url)).then(r => {
            this.services.logger.debug(`${method} ${url} successful`);
            return r.data;
        });
    }

    private getConfig(method: string, url: string): AxiosRequestConfig {
        return {
            url: url,
            method: method,
            headers: { "Authorization": `Bearer ${this.services.authService.token}` }
        };
    }

}