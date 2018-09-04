import { Component, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { Services } from "@App/Services";
import { GamesApiClient } from "@App/common/client/GamesApiClient";
import { GameListDto } from "@App/common/dto/GameListDto";

@Component({
    selector: "app-lobby-data",
    templateUrl: "./lobby.component.html"
})
export class LobbyComponent implements AfterViewInit {

    public myGames: GameListDto[] = [];
    public openGames: GameListDto[] = [];

    private gamesApiClient: GamesApiClient;

    constructor(private router: Router, private services: Services) {
        this.gamesApiClient = new GamesApiClient(this.services);
    }

    ngAfterViewInit(): void {
        setTimeout(() => this.load(), 500);
    }

    load(): void {
        this.gamesApiClient.getMyGames().then(res => this.myGames = res);
        this.gamesApiClient.getOpenGames().then(res => this.openGames = res);
    }

    create(): void {
        this.gamesApiClient.createGame().then(res => this.myGames.push(res));
    }

    join(game: GameListDto): void {
        this.router.navigate(["/game", "online", game.id]);
    }
}
