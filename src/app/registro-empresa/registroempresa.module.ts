import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { RegistroEmpresaRoutingModule } from "./registro-empresa-routing.module";

import { RegistroEmpresaComponent } from "./registro-empresa.component";


@NgModule({
  declarations: [
    RegistroEmpresaComponent
  ],
  imports: [
    RegistroEmpresaRoutingModule,
    RouterModule
  ],
  exports: []
})
export class RegistroEmpresaModule {}
