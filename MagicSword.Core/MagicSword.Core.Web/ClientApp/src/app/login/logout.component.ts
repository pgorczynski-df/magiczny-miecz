import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { Services } from "app/Services";
import { ResourceManager } from "@App/game/ResourceManager";

@Component({
    selector: "app-logout",
    templateUrl: "./logout.component.html",
})
export class LogoutComponent {

    constructor(private services: Services, private router: Router) {
    }

    logout() {
        this.services.authService.token = null;
        this.router.navigate(['/']);
    }

    res(key: string) {
        return ResourceManager.getLocalizationMessage(key);
    }
}

