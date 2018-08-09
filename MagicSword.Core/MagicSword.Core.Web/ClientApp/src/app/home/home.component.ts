import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";

import { Services } from "app/Services";
import {PlayerHubClient} from "./PlayerHubClient";
import {SocketClient as SocketService} from "../SocketClient";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
})
export class HomeComponent implements AfterViewInit {

  email: string = "";
  password: string = "";

  loginResult = "";

  constructor(private services: Services, private router: Router, private playerHub: PlayerHubClient) {
   
  }

  ngAfterViewInit() {

    this.playerHub.init();

    //var sss = new SocketService();

    //sss.initSocket();
    //sss.send({a: "aaa"});
  }

  login() {
    if (this.email.length > 1 && this.password.length > 1) {
      this.playerHub.login(this.email, this.password).subscribe(r => {
        if (r.success) {
          this.services.authService.token = r.token;
          this.router.navigate(['/lobby']);
        } else {
          this.loginResult = r.error;
        }
      });
    } else {
      this.loginResult = "Email/hasło wymagane";
    }

  }

}

