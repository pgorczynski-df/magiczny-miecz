import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { ClientServices } from "@App/ClientServices";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private services: ClientServices, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.services.clientAuthService.isValid()) {
            return true;
        } else {
            this.router.navigate(["/auth/login"], {
                queryParams: {
                    returnUrl: state.url
                }
            });
            return false;
        }
    }
}
