import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/shared/guard";
import { CrearproformaComponent } from "./crearproforma/crearproforma.component";
import { CreateEditProveedorComponent } from "./create-edit-proveedor/create-edit-proveedor.component";
import { ListaProformasComponent } from "./lista-proformas/lista-proformas.component";
import { ProveedoresComponent } from "./proveedores/proveedores.component";

const routes: Routes = [
    {
        path: 'lista-proveedores',
        component: ProveedoresComponent
    },
    {
        path: 'nuevo',
        canActivate:[AuthGuard],
        component: CreateEditProveedorComponent
    },
    {
        path: 'editar/:id',
        canActivate:[AuthGuard],
        component: CreateEditProveedorComponent
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
export class ProveedoresRoutingModule {}