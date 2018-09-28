

export class AuthService {

    private _token: string = null;

    constructor() {
        var t = localStorage.getItem("token");
        if (t) {
            this._token = t;
        }
    }

    get token(): string {
        //WTF?
        if (this._token === "null") {
            return null;
        }

        return this._token;
    }

    set token(val: string) {
        this._token = val;
        localStorage.setItem("token", this._token);
    }

    isValid() {
        return this.token !== null && this.token.length > 0;
    }

}
