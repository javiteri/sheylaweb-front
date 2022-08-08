import { NgModule } from "@angular/core";
import {RouterModule} from '@angular/router';

import { LoginComponent } from './login.component';

import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from "@angular/material/icon";

import { LoginRoutingModule } from "./login-routing.module";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [
    LoginComponent
  ],
    imports: [
        MatCardModule ,
        RouterModule,
        LoginRoutingModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: []
})
export class LoginModule { }
