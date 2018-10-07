/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Router, ActivatedRoute } from "@angular/router";
import { Component, Inject } from '@angular/core';
import { NB_AUTH_OPTIONS, NbAuthSocialLink } from '../../auth.options';
import { getDeepFromObject } from '../../helpers';


import { NbAuthService } from '../../services/auth.service';
import { NbAuthResult } from '../../services/auth-result';

import { Services } from "@App/Services";
import { AccountClient } from "@Common/client/AccountClient";
import { ResourceManager } from "@App/game/ResourceManager";

@Component({
    selector: 'nb-login',
    templateUrl: "./login.component.html",
})
export class NbLoginComponent {

    redirectDelay: number = 0;
    showMessages: any = {};
    strategy: string = '';

    errors: string[] = [];
    messages: string[] = [];
    user: any = {};
    submitted: boolean = false;
    socialLinks: NbAuthSocialLink[] = [];

    //constructor(protected service: NbAuthService,
    //            @Inject(NB_AUTH_OPTIONS) protected options = {},
    //            protected router: Router) {

    //  this.redirectDelay = this.getConfigValue('forms.login.redirectDelay');
    //  this.showMessages = this.getConfigValue('forms.login.showMessages');
    //  this.strategy = this.getConfigValue('forms.login.strategy');
    //  this.socialLinks = this.getConfigValue('forms.login.socialLinks');
    //  }

    returnUrl = "";

    accountClient: AccountClient;

    //workaround: we inject the resourceManager only to force it to be initialized
    constructor(@Inject(NB_AUTH_OPTIONS) protected options = {}, private services: Services, private router: Router, private route: ActivatedRoute, private resourceManager: ResourceManager) {
        this.accountClient = new AccountClient(this.services);
        this.route.queryParams.subscribe(params => this.returnUrl = params['returnUrl'] || '/lobby');

    }

    login() {

        this.errors = this.messages = [];
        this.submitted = true;

        this.accountClient.login(this.user.email, this.user.password).then(r => {

            this.submitted = false;

            if (r.success) {
                this.services.authService.user = r.user;
                this.router.navigateByUrl(this.returnUrl);
            } else {
                this.errors.push(this.res(r.error));
            }
        }, e => {
            this.errors.push("Server error");
            this.services.logger.error(e);
        });

    }

    res(key: string) {
        return ResourceManager.getLocalizationMessage(key);
    }

    //login(): void {
    //    this.errors = this.messages = [];
    //    this.submitted = true;

    //    this.service.authenticate(this.strategy, this.user).subscribe((result: NbAuthResult) => {
    //        this.submitted = false;

    //        if (result.isSuccess()) {
    //            this.messages = result.getMessages();
    //        } else {
    //            this.errors = result.getErrors();
    //        }

    //        const redirect = result.getRedirect();
    //        if (redirect) {
    //            setTimeout(() => {
    //                return this.router.navigateByUrl(redirect);
    //            }, this.redirectDelay);
    //        }
    //    });
    //}

    getConfigValue(key: string): any {
        return getDeepFromObject(this.options, key, null);
    }
}
