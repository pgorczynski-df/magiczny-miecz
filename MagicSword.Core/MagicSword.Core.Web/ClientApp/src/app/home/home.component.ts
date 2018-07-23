import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import { Game } from "../game/Game";
import { Event } from "../game/Event";
import { GameHubClient } from "../game/GameHubClient";
import {IActor} from "../game/logic/IActor";
import {Services} from "../game/Services";
import {EventType} from "../game/EventType";
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

