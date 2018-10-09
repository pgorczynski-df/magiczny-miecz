/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { NgModule, LOCALE_ID } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { CoreModule } from "./@core/core.module";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { ThemeModule } from "./@theme/theme.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { JwtModule } from "@auth0/angular-jwt";
import { ToasterModule } from "angular2-toaster";

import { AuthServiceBase } from "@Common/infrastructure/AuthServiceBase";
import { Services } from "@Common/infrastructure/Services";
import { AuthService } from "@App/AuthService";
import { SocketClient } from "@App/SocketClient"
import { ResourceManager } from "@App/game/ResourceManager";
import { AuthGuard } from "@App/AuthGuard";
import { ClientServices } from "@App/ClientServices";

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,

        NgbModule.forRoot(),
        ThemeModule.forRoot(),
        CoreModule.forRoot(),
        JwtModule.forRoot({
            config: {
                tokenGetter: null,
                whitelistedDomains: [],
                blacklistedRoutes: []
            }
        }),
        ToasterModule.forRoot()
    ],
    bootstrap: [AppComponent],
    providers: [
        { provide: LOCALE_ID, useValue: "en-US" },
        ClientServices,
        AuthService,
        AuthGuard,
        { provide: AuthServiceBase, useClass: AuthService },
        { provide: Services, useClass: ClientServices },
        SocketClient,
        ResourceManager,
    ],
})
export class AppModule {
}
