import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import { Game } from "../game/Game";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit {

  @ViewChild("viewport", { read: ElementRef }) viewport: ElementRef;

  private world: Game;

  constructor() {
  }

  ngAfterViewInit() {

    //console.log(this.viewport.nativeElement);

    this.world = new Game(this.viewport.nativeElement);
  }

  save = () => {
    this.world.save();
  };

}

