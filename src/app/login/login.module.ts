import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { LoginComponent } from './login.component';

import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from "@angular/material/icon";

import { OverlayModule } from "@angular/cdk/overlay";
import { LoadingService } from "src/app/services/loading.service";

import { LoginRoutingModule } from "./login-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ApplicationProvider, EndPointProvider } from "../providers/provider";

@NgModule({
    declarations: [
    LoginComponent
  ],
    imports: [
      OverlayModule,
        HttpClientModule,
        MatCardModule,
        RouterModule,
        LoginRoutingModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [LoadingService, ApplicationProvider, EndPointProvider]
})
export class LoginModule { }
