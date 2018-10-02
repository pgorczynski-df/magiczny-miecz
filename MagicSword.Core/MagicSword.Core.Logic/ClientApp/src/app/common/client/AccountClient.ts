import { HttpClient } from "@Common/client/HttpClient";
import { Services } from "@App/Services";
import { UserDto } from "@Common/client/UserDto";
import { AuthResponse } from "@Common/client/AuthResponse";

export class AccountClient extends HttpClient {

    private controller = "Account";

    constructor(services: Services) {
        super(services, services.settings.authServerUrl);
    }

    public validateToken(token: string): Promise<UserDto> {
        return this.get<UserDto>(`/${this.controller}/ValidateToken?access_token=${token}`);
    }

    public login(email: string, password: string): Promise<AuthResponse> {
        return this.post<AuthResponse>(`${this.controller}/Login`, { email: email, password: password });
    }

    public register(email: string, password: string, nickname: string): Promise<AuthResponse> {
        return this.post<AuthResponse>(`${this.controller}/Register`, { email: email, password: password, nickname: nickname });
    }

}
