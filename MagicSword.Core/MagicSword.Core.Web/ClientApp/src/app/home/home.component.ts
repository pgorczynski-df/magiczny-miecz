import { Component } from '@angular/core';

import { World } from "../game/World";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {

  private world: World;

  constructor() {

    this.world = new World();

  }

}

