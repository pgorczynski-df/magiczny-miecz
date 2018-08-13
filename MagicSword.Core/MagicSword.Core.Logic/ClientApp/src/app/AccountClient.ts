import axios from "axios";

export class AccountClient {

  private server = "http://localhost:53048";

  public validateToken(token: string) {

    axios.get<any>(this.server + '/Account/ValidateToken?access_token=' + token)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

}