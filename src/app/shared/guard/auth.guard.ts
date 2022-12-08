import { Injectable } from "@angular/core";
import { CanActivate, CanLoad, Route, Router, UrlSegment, UrlTree } from "@angular/router";


@Injectable()
export class AuthGuard implements CanActivate{

    constructor(private router: Router){}

    
    canActivate(): boolean{
        if(sessionStorage.getItem('_valtok') && sessionStorage.getItem('_valuser')){
            //console.log('inside can activate truue');
            return true;
        }
        
        //console.log('inside can activate false');
        this.router.navigate(['/login']);
        return false;

    }
    
}