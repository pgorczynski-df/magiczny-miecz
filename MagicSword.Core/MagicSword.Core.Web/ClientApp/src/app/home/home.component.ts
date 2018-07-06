import { Component } from '@angular/core';

import { Game } from "../game/Game";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {

  private world: Game;

  constructor() {

    this.world = new Game();

  }

  save = () => {
    this.world.save();
  };

}

