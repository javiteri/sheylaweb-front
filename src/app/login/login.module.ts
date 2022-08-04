import { NgModule } from "@angular/core";
import { LoginComponent } from './login.component';

import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'

import { LoginRoutingModule } from "./login-routing.module";

@NgModule({
    declarations: [
    LoginComponent
  ],
    imports: [
        MatCardModule ,
        LoginRoutingModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ],
    providers: []
})
export class LoginModule { }