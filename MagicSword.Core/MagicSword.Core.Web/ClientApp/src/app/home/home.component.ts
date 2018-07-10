import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Game } from "../game/Game";
import {IActor} from "../game/logic/IActor";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit {

  @ViewChild("viewport", { read: ElementRef }) viewport: ElementRef;

  game: Game;

  get selectedActor(): IActor {
    return this.game ? this.game.world.selectedActor : null;
  }

  constructor(private httpClient: HttpClient) {

  }

  ngAfterViewInit() {
    this.game = new Game(this.viewport.nativeElement, this.httpClient);
  }

  save = () => {
    this.game.world.save();
  };

  load = () => {
    this.game.world.load();
  };

  drawCard = () => {
    this.game.world.drawCard();
  };
}

