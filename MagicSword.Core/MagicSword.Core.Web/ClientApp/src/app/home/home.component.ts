import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import { Game } from "../game/Game";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit {

  @ViewChild("viewport", { read: ElementRef }) viewport: ElementRef;

  game: Game;

  ngAfterViewInit() {
    this.game = new Game(this.viewport.nativeElement);
  }

  save = () => {
    this.game.save();
  };

}

