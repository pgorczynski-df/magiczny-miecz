import { Component, Input, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import { ClientServices } from "@App/ClientServices";

@Component({
    selector: 'ngx-header',
    styleUrls: ['./header.component.scss'],
    templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {


    @Input() position = 'normal';

    user: any;

    userMenu = [{ title: 'Profile' }, { title: 'Log out' }];

    constructor(private sidebarService: NbSidebarService,
        private menuService: NbMenuService,
        private userService: UserService,
        private analyticsService: AnalyticsService,
        private router: Router,
        private services: ClientServices) {
    }

    userName(): string {
        var user = this.services.clientAuthService.user;
        return user ? user.nickname : "Niezalogowany";
    }

    userLoggedIn(): boolean {
        return this.services.clientAuthService.isLoggedIn();
    }

    logout() {
        this.services.clientAuthService.logout();
        this.menuService.navigateHome();
    }

    ngOnInit() {
        this.userService.getUsers()
            .subscribe((users: any) => this.user = users.nick);
    }

    toggleSidebar(): boolean {
        this.sidebarService.toggle(true, 'menu-sidebar');
        return false;
    }

    toggleSettings(): boolean {
        this.sidebarService.toggle(false, 'settings-sidebar');
        return false;
    }

    goToHome() {
        this.menuService.navigateHome();
    }

    startSearch() {
        this.analyticsService.trackEvent('startSearch');
    }

    localGame(): void {
        this.router.navigate(["pages", "game", "local", "1"]);
    }
}
