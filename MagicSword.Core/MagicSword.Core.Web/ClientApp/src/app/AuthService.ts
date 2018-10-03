import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable()
export class AuthService {

    private _token: string = null;

    constructor(private jwtHelper: JwtHelperService) {

        var t = localStorage.getItem("token");
        if (t) {
            this._token = t;
        }
    }

    get token(): string {

        if (this._token === "null") { //WTF?
            this._token = null;
        }

        return this._token;
    }

    set token(val: string) {
        this._token = val;
        localStorage.setItem("token", this._token);
    }

    isValid() {
        if (this.token !== null && this.token.length > 0) {
            try {
                return !this.jwtHelper.isTokenExpired(this.token);
            }
            catch (e) {
                if ((e as string).indexOf("The inspected token doesn't appear to be a JWT") > 0) {
                    return false;
                }
                throw e;
            }
        }
        return false;
    }

}
