import { AuthServiceBase } from "@Common/infrastructure/AuthServiceBase";

export class AuthService extends AuthServiceBase {

    private _token: string = null;

    getToken(): string {
        return this._token;
    }

    setToken(val: string) {
        this._token = val;
    }
}
