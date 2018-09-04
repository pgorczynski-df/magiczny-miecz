import axios from "axios";
import { AxiosRequestConfig } from "axios";
import { Services } from "@App/Services";
import { StringUtils } from "@App/common/utils/StringUtils";

export class HttpClient {

    constructor(private services: Services, private serverUrl) {
        this.serverUrl = StringUtils.slashify(this.serverUrl);
    }

    public get<T = any>(url: string): Promise<T> {
        return this.request<T>("GET", url, null);
    }

    public post<T = any>(url: string, data: any = null): Promise<T> {
        return this.request<T>("POST", url, data);
    }

    public patch<T = any>(url: string, data: any = null): Promise<T> {
        return this.request<T>("PATCH", url, data);
    }

    protected request<T>(method: string, url: string, data: any): Promise<T> {

        if (url.startsWith("/")) {
            url = url.substring(1);
        }
        url = this.serverUrl + url;

        this.services.logger.debug(`Attempting to ${method} ${url}`);
        return axios.request<T>(this.getConfig(method, url, data)).then(r => {
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


