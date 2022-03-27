import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserInfoService } from '../services/user-info.service';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {
    constructor(private userInfo: UserInfoService) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return !!this.userInfo.currentUser;
    }
}
