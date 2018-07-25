

export class AuthService {

  private _token: string = null;

  get token(): string {
    return this._token;
  }

  set token(val: string) {
    this._token = val;
  }

}
