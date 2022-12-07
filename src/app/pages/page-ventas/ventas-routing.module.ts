import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/shared/guard";
import { ListaVentasComponent } from "./lista-ventas/lista-ventas.component";
import { PageVentasComponent } from "./page-ventas.component";
import { ResumenVentasComponent } from "./resumen-ventas/resumen-ventas.component";


const routes: Routes = [
    {
        path: 'crearventa',
        canActivate: [AuthGuard],
        component: PageVentasComponent
    },
    {
        path: 'crearventa/:idventa',
        canActivate: [AuthGuard],
        component: PageVentasComponent
    },
    {
        path: 'listaventas',
        canActivate: [AuthGuard],
        component: ListaVentasComponent
    },
    {
        path: 'resumenventas',
        canActivate: [AuthGuard],
        component: ResumenVentasComponent
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class VentasRoutingModule {}