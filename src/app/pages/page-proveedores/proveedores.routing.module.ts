import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreateEditProveedorComponent } from "./create-edit-proveedor/create-edit-proveedor.component";
import { ProveedoresComponent } from "./proveedores/proveedores.component";

const routes: Routes = [
    {
        path: '',
        component: ProveedoresComponent
    },
    {
        path: 'nuevo',
        component: CreateEditProveedorComponent
    },
    {
        path: 'editar/:id',
        component: CreateEditProveedorComponent
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class ProveedoresRoutingModule {}