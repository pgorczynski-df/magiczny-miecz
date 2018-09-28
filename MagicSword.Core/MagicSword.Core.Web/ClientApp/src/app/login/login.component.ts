import { AfterViewInit, Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { Services } from "app/Services";
import { AccountClient } from "@App/common/client/AccountClient";
import { ResourceManager } from "@App/game/ResourceManager";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
})
export class LoginComponent implements AfterViewInit {

    email: string = "";
    password: string = "";

    loginResult = "";

    return = "";

    accountClient: AccountClient;

    //workaround: we inject the resourceManager only to force it to be initialized
    constructor(private services: Services, private router: Router, private route: ActivatedRoute, private resourceManager: ResourceManager) {
        this.accountClient = new AccountClient(this.services);
    }

    ngAfterViewInit() {
        this.route.queryParams
            .subscribe(params => this.return = params['return'] || '/lobby');
    }

    login() {
        if (this.email.length > 1 && this.password.length > 1) {
            this.accountClient.login(this.email, this.password).then(r => {
                if (r.success) {
                    this.services.authService.token = r.user.token;
                    this.router.navigateByUrl(this.return);
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

