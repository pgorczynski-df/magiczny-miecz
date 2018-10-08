//this was a interface, but Angular DI doesn't support injecting interface implementation...

export class AuthServiceBase {

    getToken(): string {
        throw new Error("not implemented");
    }

    isLoggedIn(): boolean {
        throw new Error("not implemented");
    }
}
