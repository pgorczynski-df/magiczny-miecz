import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import {Services} from "../game/Services";
import {PlayerHubClient} from "./PlayerHubClient";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
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
    this.playerHub.login(this.email, this.password);
  }

}

