import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/shared/guard";
import { NuevoClienteComponent } from "./nuevo-cliente/nuevo-cliente.component";
import { PageClientesComponent } from "./lista-clientes/page-clientes.component";
import { CrearproformaComponent } from "./crearproforma/crearproforma.component";
import { ListaProformasComponent } from "./lista-proformas/lista-proformas.component";


const routes: Routes = [
    {
        path: 'lista-clientes',
        canActivate:[AuthGuard],
        component: PageClientesComponent
    },
    {
        path: 'nuevo',
        canActivate:[AuthGuard],
        component: NuevoClienteComponent
    },
    {
        path: 'editar/:id',
        canActivate:[AuthGuard],
        component: NuevoClienteComponent
    },
    {
        path: 'crearproforma',
        canActivate: [AuthGuard],
        component: CrearproformaComponent
    },
    {
        path: 'crearproforma/:id',
        canActivate: [AuthGuard],
        component: CrearproformaComponent
    },
    {
        path: 'lista-proformas',
        canActivate: [AuthGuard],
        component: ListaProformasComponent
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class ClientesRoutingModule {}