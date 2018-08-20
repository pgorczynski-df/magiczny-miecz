import axios from "axios";
import { AxiosRequestConfig } from "axios";
import { Services } from "@App/Services";
import { StringUtils } from "@App/common/utils/StringUtils";

export class HttpClient {

    constructor(private services: Services, private serverUrl) {
        this.serverUrl = StringUtils.slashify(this.serverUrl);
    }

    public get(url: string): Promise<any> {
        return this.request("GET", url, null);
    }

    public post(url: string, data: any = null): Promise<any> {
        return this.request("POST", url, data);
    }

    protected request(method: string, url: string, data: any) {

        if (url.startsWith("/")) {
            url = url.substring(1);
        }
        url = this.serverUrl + url;

        this.services.logger.debug(`Attempting to ${method} ${url}`);
        return axios.request<any>(this.getConfig(method, url, data)).then(r => {
            this.services.logger.debug(`${method} ${url} successful`);
            return r.data;
        });
    }

    private getConfig(method: string, url: string, data: any): AxiosRequestConfig {
        return {
            url: url,
            method: method,
            data: data,
            headers: {
                "Authorization": `Bearer ${this.services.authService.token}`,
            }
        };
    }

}


