import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";


@Injectable()
export class AuthGuard implements CanActivate{

    constructor(private router: Router){}

    canActivate(): boolean{
        
        console.log('inside can Activate');
        if (localStorage.getItem('DATA_TOK')) {
            console.log('is true');
            return true;
        }

        console.log('is false');
        this.router.navigate(['/login']);
        return false;

    }
    
}