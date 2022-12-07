import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/shared/guard";
import { CreateEditProveedorComponent } from "./create-edit-proveedor/create-edit-proveedor.component";
import { ProveedoresComponent } from "./proveedores/proveedores.component";

const routes: Routes = [
    {
        path: '',
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
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class ProveedoresRoutingModule {}