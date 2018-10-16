import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from "@App/pages/miscellaneous/not-found/not-found.component";

import { GameComponent } from "@App/game/game.component";
import { AuthGuard } from "@App/AuthGuard";

const routes: Routes = [{
    path: '',
    component: PagesComponent,
    children: [
        {
            path: 'dashboard',
            component: DashboardComponent,
        },
        {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full',
        },
        {
            path: 'error',
            component: NotFoundComponent,
        },
        {
            path: "game/local/:gameId",
            component: GameComponent
        },
        {
            path: "game/online/:gameId",
            component: GameComponent,
            canActivate: [AuthGuard] 
        },
    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule {
}
