import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";

import { Services } from "app/Services";
import {PlayerHubClient} from "./PlayerHubClient";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
})
export class HomeComponent implements AfterViewInit {

  email: string = "";
  password: string = "";

  loginResult = "";

  playerHub: PlayerHubClient;

  constructor(private services: Services) {
   
  }

  ngAfterViewInit() {

    this.playerHub = new PlayerHubClient(this.services);

  }

  login() {
    if (this.email.length > 1 && this.password.length > 1) {
      this.playerHub.login(this.email, this.password).subscribe(r => {
        if (r.success) {
          this.loginResult = r.token;
        } else {
          this.loginResult = r.error;
        }
      });
    } else {
      this.loginResult = "Email/hasło wymagane";
    }

  }

}

