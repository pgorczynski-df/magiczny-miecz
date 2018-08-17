import axios from "axios";

export class AccountClient {

    private server = "http://localhost:53048";
    private controller = "Account";

    public validateToken(token: string): Promise<any> {
        return axios.get<any>(`${this.server}/${this.controller}/ValidateToken?access_token=${token}`).then(r => { return r.data; });
    }

    public login(email: string, password: string): Promise<any> {
        return axios.post<any>(`${this.server}/${this.controller}/Login?email=${email}&password=${password}`).then(r => { return r.data; });
    }

}