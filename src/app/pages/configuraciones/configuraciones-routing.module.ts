import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ConfiguracionesComponent } from "./configuraciones.component";

const routes: Routes = [
    {
      path: '',
      component: ConfiguracionesComponent
    }
]

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class ConfiguracionesRoutingModule { }