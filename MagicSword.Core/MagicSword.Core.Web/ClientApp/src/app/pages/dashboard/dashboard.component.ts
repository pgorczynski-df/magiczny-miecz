import { Component, AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";

import { Services } from "@Common/infrastructure/Services";
import { GamesApiClient } from "@Common/client/GamesApiClient";
import { GameListDto } from "@Common/dto/GameListDto";

@Component({
    selector: 'ngx-dashboard',
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements AfterViewInit {

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
        this.router.navigate(["pages", "game", "online", game.id]);
    }

}
