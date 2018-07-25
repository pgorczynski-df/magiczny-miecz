import { Component, Inject } from "@angular/core";
import { Services } from "app/Services";
import { GameListDto } from "app/lobby/dto/GameListDto";
import { PlayerHubClient } from "app/home/PlayerHubClient";

@Component({
  selector: "app-lobby-data",
  templateUrl: "./lobby.component.html"
})
export class LobbyComponent {
  public games: GameListDto[];

  constructor(private services: Services, private hub: PlayerHubClient) {

    this.hub.getMyGames().subscribe(res => this.games = res);

  }

  create(): void {
    this.hub.createGame().subscribe(res => this.games.push(res));
  }
}
