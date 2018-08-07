import { Component, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { Services } from "app/Services";
import { GameListDto } from "app/lobby/dto/GameListDto";
import { PlayerHubClient } from "app/home/PlayerHubClient";

@Component({
  selector: "app-lobby-data",
  templateUrl: "./lobby.component.html"
})
export class LobbyComponent implements AfterViewInit {

  public myGames: GameListDto[] = [];
  public openGames: GameListDto[] = [];

  constructor(private router: Router, private services: Services, private hub: PlayerHubClient) {

    this.hub = new PlayerHubClient(this.services);
    this.hub.init().then(r => {
      this.load();
    });

  }

  ngAfterViewInit(): void {
    //setTimeout(() => this.load(), 500);
  }

  load(): void {
    this.hub.getMyGames().subscribe(res => this.myGames = res);
    this.hub.getOpenGames().subscribe(res => this.openGames = res);
  }

  create(): void {
    this.hub.createGame().subscribe(res => this.myGames.push(res));
  }

  join(game: GameListDto): void {
    this.router.navigate(["/game", "online", game.id]);
  }
}
