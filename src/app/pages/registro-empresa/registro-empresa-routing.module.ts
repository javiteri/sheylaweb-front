import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { RegistroEmpresaComponent } from "./registro-empresa.component";


const routes: Routes = [
  {
    path: '',
    component: RegistroEmpresaComponent
  }
]

@NgModule({
  declarations: [],
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class RegistroEmpresaRoutingModule {}
