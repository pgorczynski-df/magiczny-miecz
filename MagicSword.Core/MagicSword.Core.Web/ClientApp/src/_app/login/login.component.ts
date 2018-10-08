import { AfterViewInit, Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { AccountClient } from "@Common/client/AccountClient";
import { ResourceManager } from "@App/game/ResourceManager";
import { ClientServices } from "@App/ClientServices";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
})
export class LoginComponent implements AfterViewInit {

    email: string = "";
    password: string = "";

    loginResult = "";

    returnUrl = "";

    accountClient: AccountClient;

    //workaround: we inject the resourceManager only to force it to be initialized
    constructor(private services: ClientServices, private router: Router, private route: ActivatedRoute, private resourceManager: ResourceManager) {
        this.accountClient = new AccountClient(this.services);

        this.route.queryParams.subscribe(params => this.returnUrl = params['returnUrl'] || '/lobby');
    }

    ngAfterViewInit() {
    }

    login() {
        if (this.email.length > 1 && this.password.length > 1) {
            this.accountClient.login(this.email, this.password).then(r => {
                if (r.success) {
                    this.services.clientAuthService.user = r.user;
                    this.router.navigateByUrl(this.returnUrl);
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

