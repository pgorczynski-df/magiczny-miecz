import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from "rxjs/operators";

import { Game } from "../game/Game";
import { Event } from "../game/Event";
import { GameHubClient } from "../game/GameHubClient";
import { IActor } from "../game/logic/IActor";
import { Services } from "../game/Services";
import { EventType } from "../game/EventType";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
})
export class GameComponent implements AfterViewInit {

  @ViewChild("viewport", { read: ElementRef }) viewport: ElementRef;

  game: Game;
  hub: GameHubClient;

  get selectedActor(): IActor {
    return this.game ? this.game.world.selectedActor : null;
  }

  constructor(private route: ActivatedRoute, private services: Services) {
  }

  events: Event[] = [];

  ngAfterViewInit() {

    this.route.paramMap.subscribe(d => {
      var mode = d.get("mode");
      this.services.logger.info("Starting game in " + mode + " mode");

      this.game = new Game(this.viewport.nativeElement, this.services);

      switch (mode) {
        case "local":
          break;
        case "online":
          this.hub = new GameHubClient(this.services);
          break;
        default:
          throw new Error("unknown mode: " + mode);
      }
    });


  }

  new = () => {
    this.game.new();
  }

  save = () => {
    this.game.save();
  };

  load = () => {
    //this.game.load();

    this.events.push({ eventType: "asdasda", data: "asdasd" } as Event);

    //this.services.outboundBus.publish(EventType.GameLoadRequest);
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

