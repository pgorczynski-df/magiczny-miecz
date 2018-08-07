import { Component, Inject } from "@angular/core";
import { Services } from "app/Services";
import { GameListDto } from "app/lobby/dto/GameListDto";
import { PlayerHubClient } from "app/home/PlayerHubClient";

@Component({
  selector: "app-lobby-data",
  templateUrl: "./lobby.component.html"
})
export class LobbyComponent {

  public myGames: GameListDto[] = [];
  public openGames: GameListDto[] = [];

  constructor(private services: Services, private hub: PlayerHubClient) {

    this.hub = new PlayerHubClient(this.services);
    this.hub.init();

  }

  load():void {
    this.hub.getMyGames().subscribe(res => this.myGames = res);
    this.hub.getOpenGames().subscribe(res => this.openGames = res);
  }

  create(): void {
    this.hub.createGame().subscribe(res => this.myGames.push(res));
  }

  join(game: GameListDto): void {
    this.hub.joinGame(game.id).subscribe(res => {});
  }
}
