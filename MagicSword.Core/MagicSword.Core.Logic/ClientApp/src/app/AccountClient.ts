import axios from "axios";

export class AccountClient {

  private server = "http://localhost:53048";

  public validateToken(token: string) : Promise<any> {
    return axios.get<any>(`${this.server}/Account/ValidateToken?access_token=${token}`);
  }

}