import { BrowserModule } from "@angular/platform-browser";
import { NgModule, LOCALE_ID } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { JwtModule } from '@auth0/angular-jwt';

import { AppComponent } from "./app.component";
import { NavMenuComponent } from "./nav-menu/nav-menu.component";
import { HomeComponent } from "./home/home.component";
import { GameComponent } from "@App/game/game.component";
import { CounterComponent } from "./counter/counter.component";
import { LobbyComponent } from "./lobby/lobby.component";
import { LoginComponent } from "./login/login.component";
import { LogoutComponent } from "./login/logout.component";

import { Services } from "@Common/infrastructure/Services";
import { AuthService } from "@App/AuthService";
import { SocketClient } from "@App/SocketClient"
import { ResourceManager } from "@App/game/ResourceManager";
import { AuthGuard } from "@App/AuthGuard";

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        GameComponent,
        CounterComponent,
        LobbyComponent,
        LoginComponent,
        LogoutComponent,
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
        HttpClientModule,
        FormsModule,
        RouterModule.forRoot([
            { path: "", component: HomeComponent, pathMatch: "full" },
            { path: "game/online/:gameId", component: GameComponent, canActivate: [AuthGuard] },
            { path: "game/local/:gameId", component: GameComponent },
            { path: "counter", component: CounterComponent },
            { path: "lobby", component: LobbyComponent, canActivate: [AuthGuard] },
            { path: "login", component: LoginComponent },
        ]),
        NgbModule.forRoot(),
        JwtModule.forRoot({
            config: {
                tokenGetter: null,
                whitelistedDomains: [],
                blacklistedRoutes: []
            }
        })
    ],
    providers: [
        { provide: LOCALE_ID, useValue: "en-US" },
        AuthGuard,
        AuthService,
        Services,
        SocketClient,
        ResourceManager,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
