import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PageVentasComponent } from "./page-ventas.component";


const routes: Routes = [
    {
        path: '',
        component: PageVentasComponent
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class VentasRoutingModule {}