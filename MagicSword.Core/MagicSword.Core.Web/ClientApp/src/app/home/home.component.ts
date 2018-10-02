import { AfterViewInit, Component } from "@angular/core";
import { Router } from "@angular/router";

import { Services } from "app/Services";
import { AccountClient } from "@Common/client/AccountClient";
import { ResourceManager } from "@App/game/ResourceManager";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
})
export class HomeComponent implements AfterViewInit {

    email: string = "";
    password: string = "";
    password2: string = "";
    nickname: string = "";

    loginResult = "";

    accountClient: AccountClient;

    //workaround: we inject the resourceManager only to force it to be initialized
    constructor(private services: Services, private router: Router, private resourceManager: ResourceManager) {
        this.accountClient = new AccountClient(this.services);
    }

    ngAfterViewInit() {
    }

    register() {
        if (this.email.length > 1 && this.password.length > 1 && this.nickname.length > 1) {
            this.accountClient.register(this.email, this.password, this.nickname).then(r => {
                if (r.success) {
                    this.services.authService.token = r.user.token;
                    this.router.navigate(['/lobby']);
                } else {
                    this.loginResult = this.res(r.error);
                }
            }, e => {
                this.loginResult = "Error";
                this.services.logger.error(e);
            });
        } else {
            this.loginResult = this.res("login_email_password_required");
        }
    }

    res(key: string) {
        return ResourceManager.getLocalizationMessage(key);
    }
}

