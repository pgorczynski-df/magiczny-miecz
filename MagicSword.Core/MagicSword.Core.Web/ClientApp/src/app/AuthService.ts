import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { UserDto } from "@Common/client/UserDto";

@Injectable()
export class AuthService {

    private _user: UserDto = null;

    constructor(private jwtHelper: JwtHelperService) {

        this.loadUser();
    }

    get user(): UserDto {
        return this._user;
    }

    set user(val: UserDto) {
        if (!val) {
            return;
        }
        this._user = val;
        this.saveUser();
    }

    get token(): string {

        if (this._user === null) {
            return null;
        }

        return this._user.token;
    }

    private loadUser() {
        var user = localStorage.getItem("user");
        if (user) {
            try {
                this._user = JSON.parse(user);
            } catch (e) {
                console.warn(e);
                this._user = null;
            }
        }
    }

    private saveUser() {
        var user = JSON.stringify(this._user);
        localStorage.setItem("user", user);
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
