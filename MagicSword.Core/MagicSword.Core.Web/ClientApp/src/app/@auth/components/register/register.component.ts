/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { NB_AUTH_OPTIONS, NbAuthSocialLink } from '../../auth.options';
import { getDeepFromObject } from '../../helpers';

import { NbAuthService } from '../../services/auth.service';
import { NbAuthResult } from '../../services/auth-result';

import { AccountClient } from "@Common/client/AccountClient";
import { ResourceManager } from "@App/game/ResourceManager";
import { ClientServices } from "@App/ClientServices";


@Component({
    selector: 'nb-register',
    styleUrls: ['./register.component.scss'],
    templateUrl: "./register.component.html",
})
export class NbRegisterComponent {

    redirectDelay: number = 0;
    showMessages: any = {};
    strategy: string = '';

    submitted = false;
    errors: string[] = [];
    messages: string[] = [];
    user: any = {};
    socialLinks: NbAuthSocialLink[] = [];

    returnUrl = "";

    accountClient: AccountClient;

    //workaround: we inject the resourceManager only to force it to be initialized
    constructor(@Inject(NB_AUTH_OPTIONS) protected options = {}, private services: ClientServices, private router: Router, private route: ActivatedRoute, private resourceManager: ResourceManager) {
        this.accountClient = new AccountClient(this.services);

        this.route.queryParams.subscribe(params => this.returnUrl = params['returnUrl'] || '/lobby');
    }

    ngAfterViewInit() {
    }

    register() {

        this.errors = this.messages = [];
        this.submitted = true;

        this.accountClient.register(this.user.email, this.user.password, this.user.fullName).then(r => {
            if (r.success) {
                this.services.clientAuthService.user = r.user;
                this.router.navigateByUrl(this.returnUrl);
            } else {
                this.errors.push(this.res(r.error));
            }
        }, e => {
            this.errors.push("Server error");
            this.services.logger.error(e);
        });
    }

    //constructor(protected service: NbAuthService,
    //            @Inject(NB_AUTH_OPTIONS) protected options = {},
    //            protected router: Router) {

    //  this.redirectDelay = this.getConfigValue('forms.register.redirectDelay');
    //  this.showMessages = this.getConfigValue('forms.register.showMessages');
    //  this.strategy = this.getConfigValue('forms.register.strategy');
    //  this.socialLinks = this.getConfigValue('forms.login.socialLinks');
    //}

    //register(): void {
    //  this.errors = this.messages = [];
    //  this.submitted = true;

    //  this.service.register(this.strategy, this.user).subscribe((result: NbAuthResult) => {
    //    this.submitted = false;
    //    if (result.isSuccess()) {
    //      this.messages = result.getMessages();
    //    } else {
    //      this.errors = result.getErrors();
    //    }

    //    const redirect = result.getRedirect();
    //    if (redirect) {
    //      setTimeout(() => {
    //        return this.router.navigateByUrl(redirect);
    //      }, this.redirectDelay);
    //    }
    //  });
    //}

    getConfigValue(key: string): any {
        return getDeepFromObject(this.options, key, null);
    }

    res(key: string) {
        return ResourceManager.getLocalizationMessage(key);
    }
}
