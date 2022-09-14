import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListaVentasComponent } from "./lista-ventas/lista-ventas.component";
import { PageVentasComponent } from "./page-ventas.component";


const routes: Routes = [
    {
        path: 'crearventa',
        component: PageVentasComponent
    },
    {
        path: 'listaventas',
        component: ListaVentasComponent
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class VentasRoutingModule {}