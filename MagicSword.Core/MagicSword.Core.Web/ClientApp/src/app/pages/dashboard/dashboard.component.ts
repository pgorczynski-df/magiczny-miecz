import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";

import { Services } from "@Common/infrastructure/Services";
import { GamesApiClient } from "@Common/client/GamesApiClient";
import { GameListDto } from "@Common/dto/GameListDto";
import { GameVisibility } from "@Common/model/GameVisibility";

@Component({
    selector: 'ngx-dashboard',
    styleUrls: ["./dashboard.component.scss"],
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements AfterViewInit, OnDestroy {


    public myGames: GameListDto[] = [];
    public openGames: GameListDto[] = [];

    private gamesApiClient: GamesApiClient;

    private timer: any;

    constructor(private router: Router, private services: Services) {
        this.gamesApiClient = new GamesApiClient(this.services);
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.load();
        }, 500);
        //this.timer = setInterval(async () => await this.load(), 5000);
    }

    ngOnDestroy(): void {
        clearInterval(this.timer);
    }

    private async load() {
        await this.loadOpenGames();

        if (this.isUserLoggedIn()) {
            await this.loadMyGames();
        }
    }

    async loadMyGames() {
        this.myGames = await this.gamesApiClient.getMyGames();
    }

    async loadOpenGames() {
        this.openGames = await this.gamesApiClient.getOpenGames();
    }

    create(): void {
        this.gamesApiClient.createGame().then(res => this.myGames.push(res));
    }

    join(game: GameListDto): void {
        this.router.navigate(["pages", "game", "online", game.id]);
    }


    delete(game: GameListDto): void {
        if (confirm("Czy na pewno usunąć grę?")) {
            this.gamesApiClient.deleteGame(game.id)
                .then(_ => {
                    this.myGames = this.myGames.filter(g => g.id !== game.id);
                });
        }
    }

    isUserLoggedIn() {
        return this.services.authService.isLoggedIn();
    }

    get itemsList() {
        return GameVisibility.all;
    }

    onItemChange(newItem: string, game: GameListDto) {
        console.log(newItem + " " + game.id);
    }

}
