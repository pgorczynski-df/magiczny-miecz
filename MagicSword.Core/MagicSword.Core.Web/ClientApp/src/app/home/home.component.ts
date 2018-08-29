import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";

import { Services } from "app/Services";
import { AccountClient } from "@App/common/client/AccountClient";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
})
export class HomeComponent implements AfterViewInit {

    email: string = "";
    password: string = "";

    loginResult = "";

    accountClient: AccountClient;

    constructor(private services: Services, private router: Router) {
        this.accountClient = new AccountClient(this.services);
    }

    ngAfterViewInit() {
    }

    login() {
        if (this.email.length > 1 && this.password.length > 1) {
            this.accountClient.login(this.email, this.password).then(r => {
                if (r.success) {
                    this.services.authService.token = r.token;
                    this.router.navigate(['/lobby']);
                } else {
                    this.loginResult = r.error;
                }
            });
        } else {
            this.loginResult = "Email/hasło wymagane";
        }

    }

}

