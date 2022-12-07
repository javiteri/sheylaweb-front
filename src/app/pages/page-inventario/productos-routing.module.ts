import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/shared/guard";
import { CrearEditarProductoComponent } from "./crear-editar-producto/crear-editar-producto.component";
import { PageInventarioComponent } from "./page-inventario.component";


const routes: Routes = [
    {
        path: '',
        component: PageInventarioComponent
    },
    {
        path: 'nuevo',
        canActivate:[AuthGuard],
        component: CrearEditarProductoComponent
    },
    {
        path: 'editar/:id',
        canActivate:[AuthGuard],
        component: CrearEditarProductoComponent
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class ProductosRoutingModule {}