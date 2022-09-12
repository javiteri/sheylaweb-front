import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";


@Injectable()
export class AuthGuard implements CanActivate{

    constructor(private router: Router){}

    canActivate(): boolean{

        if(sessionStorage.getItem('_valtok') && sessionStorage.getItem('_valuser')){
            return true;
        }

        this.router.navigate(['/login']);
        return false;

    }
    
}