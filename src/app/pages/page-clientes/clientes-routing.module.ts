import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NuevoClienteComponent } from "./nuevo-cliente/nuevo-cliente.component";
import { PageClientesComponent } from "./page-clientes.component";


const routes: Routes = [
    {
        path: '',
        component: PageClientesComponent
    },
    {
        path: 'nuevo',
        component: NuevoClienteComponent
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class ClientesRoutingModule {}