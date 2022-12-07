import { Injectable } from "@angular/core";
import { CanActivate, CanLoad, Route, Router, UrlSegment, UrlTree } from "@angular/router";
import { Observable } from "rxjs";


@Injectable()
export class AuthGuard implements CanActivate{

    constructor(private router: Router){}

    
    canActivate(): boolean{

        console.log('inside auth guard');
        if(sessionStorage.getItem('_valtok') && sessionStorage.getItem('_valuser')){
            //console.log('inside can activate truue');
            return true;
        }
        
        //console.log('inside can activate false');
        this.router.navigate(['/login']);
        return false;

    }
    
}