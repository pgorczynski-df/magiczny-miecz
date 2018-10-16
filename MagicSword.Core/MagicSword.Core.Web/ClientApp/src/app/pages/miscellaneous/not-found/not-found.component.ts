import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { NbMenuService } from '@nebular/theme';
import { ErrorDto } from "@Common/dto/ErrorDto";

@Component({
    selector: 'ngx-not-found',
    styleUrls: ['./not-found.component.scss'],
    templateUrl: './not-found.component.html',
})
export class NotFoundComponent {

    title: string = "Error";
    message: string = "Ooops";

    constructor(private menuService: NbMenuService, private route: ActivatedRoute) {
        this.route.queryParamMap.subscribe(d => {
            var json = d.get("errorDto");
            if (json) {
                var dto = JSON.parse(json) as ErrorDto;
                this.title = dto.code.toString();
                this.message = dto.reason;
            }
        });
    }

    goToHome() {
        this.menuService.navigateHome();
    }
}
