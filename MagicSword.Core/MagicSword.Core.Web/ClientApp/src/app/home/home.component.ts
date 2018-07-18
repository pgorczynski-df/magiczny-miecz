import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Game } from "../game/Game";
import { GameHubClient } from "../game/GameHubClient";
import {IActor} from "../game/logic/IActor";
import {Services} from "../game/Services";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit {

  @ViewChild("viewport", { read: ElementRef }) viewport: ElementRef;

  game: Game;
  hub: GameHubClient;

  get selectedActor(): IActor {
    return this.game ? this.game.world.selectedActor : null;
  }

  constructor(private services: Services) {

  }

  ngAfterViewInit() {
    this.hub = new GameHubClient(this.services);
    this.game = new Game(this.viewport.nativeElement, this.services);
  }

  new = () => {
    this.game.new();
  }

  save = () => {
    this.game.save();
  };

  load = () => {
    this.game.load();
  };

  drawCard = () => {
    this.game.world.drawCard();
  };

  disposeCard = () => {
    this.game.world.disposeCard();
  };

  sendMessage = () => {
    this.hub.sendDirectMessage("dada", "userName");
  }
}

