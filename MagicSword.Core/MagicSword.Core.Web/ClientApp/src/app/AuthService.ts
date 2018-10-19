import { Injectable } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";

import { JwtHelperService } from "@auth0/angular-jwt";

import { UserDto } from "@Common/client/UserDto";
import { AuthServiceBase } from "@Common/infrastructure/AuthServiceBase";

@Injectable()
export class AuthService extends AuthServiceBase {

    private _user: UserDto = null;

    constructor(private jwtHelper: JwtHelperService, private router: Router) {
        super();
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

    getToken(): string {

        if (this._user === null) {
            return null;
        }

        return this._user.token;
    }

    logout() {
        this._user = null;
        localStorage.removeItem("user");
    }

    isLoggedIn(): boolean {
        return this.user !== null;
    }

    logoutAndNavigateToLogin(returnUrl: any) {
        this.logout();
        this.router.navigate(["auth", "login"], { queryParams: { returnUrl: location } });
    }

    //TODO move to separate service
    navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
        return this.router.navigate(commands, extras);
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
        var token = this.getToken();
        if (token && token.length && token.length > 0) {
            try {
                return !this.jwtHelper.isTokenExpired(token);
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
