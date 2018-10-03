import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Services } from "@App/Services";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private services: Services, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.services.authService.isValid()) {
            return true;
        } else {
            this.router.navigate(["/login"], {
                queryParams: {
                    returnUrl: state.url
                }
            });
            return false;
        }
    }
}
