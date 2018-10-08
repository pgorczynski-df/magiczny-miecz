import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { ResourceManager } from "@App/game/ResourceManager";
import { ClientServices } from "@App/ClientServices";

@Component({
    selector: "app-logout",
    templateUrl: "./logout.component.html",
})
export class LogoutComponent {

    constructor(private services: ClientServices, private router: Router) {
    }

    logout() {
        this.services.clientAuthService.logout();
        this.router.navigate(['/']);
    }

    res(key: string) {
        return ResourceManager.getLocalizationMessage(key);
    }
}

