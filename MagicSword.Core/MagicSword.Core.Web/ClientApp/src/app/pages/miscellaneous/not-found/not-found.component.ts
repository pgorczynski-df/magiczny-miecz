import { AfterViewInit, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { NbMenuService } from '@nebular/theme';

@Component({
    selector: 'ngx-not-found',
    styleUrls: ['./not-found.component.scss'],
    templateUrl: './not-found.component.html',
})
export class NotFoundComponent implements AfterViewInit {

    message: string = "";

    constructor(private menuService: NbMenuService, private route: ActivatedRoute) {
    }

    ngAfterViewInit(): void {
        this.route.paramMap.subscribe(d => {
            this.message = d.get("message");
        });
    }

    goToHome() {
        this.menuService.navigateHome();
    }
}
