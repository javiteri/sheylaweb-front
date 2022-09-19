import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListaVentasComponent } from "./lista-ventas/lista-ventas.component";
import { PageVentasComponent } from "./page-ventas.component";
import { ResumenVentasComponent } from "./resumen-ventas/resumen-ventas.component";


const routes: Routes = [
    {
        path: 'crearventa',
        component: PageVentasComponent
    },
    {
        path: 'listaventas',
        component: ListaVentasComponent
    },
    {
        path: 'resumenventas',
        component: ResumenVentasComponent
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class VentasRoutingModule {}