import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'

import { RegistroEmpresaRoutingModule } from "./registro-empresa-routing.module";
import { ApplicationProvider, EndPointProvider } from "../providers/provider";
import { RegistroEmpresaComponent } from "./registro-empresa.component";


@NgModule({
  declarations: [
    RegistroEmpresaComponent
  ],
  imports: [
    RegistroEmpresaRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  exports: [],
  providers: [ApplicationProvider, EndPointProvider]
})
export class RegistroEmpresaModule {}
