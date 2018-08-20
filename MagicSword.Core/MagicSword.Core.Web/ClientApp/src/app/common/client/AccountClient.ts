import { HttpClient } from "@App/common/client/HttpClient";
import { Services } from "@App/Services";

export class AccountClient extends HttpClient {

    private controller = "Account";

    constructor(services: Services) {
        super(services.settings.authServerUrl, services);
    }

    public validateToken(token: string): Promise<any> {
        return super.get(`${this.controller}/ValidateToken?access_token=${token}`);
    }

    public login(email: string, password: string): Promise<any> {
        return super.post(`${this.controller}/Login?email=${email}&password=${password}`);
    }

}
