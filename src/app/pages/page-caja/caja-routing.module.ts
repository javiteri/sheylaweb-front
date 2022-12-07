import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/shared/guard";
import { CuadrarCajaComponent } from "./cuadrar-caja/cuadrar-caja.component";
import { MovimientosCajaComponent } from "./movimientos-caja/movimientos-caja.component";

const routes: Routes = [
    {
        path: 'movimientoscaja',
        canActivate:[AuthGuard],
        component: MovimientosCajaComponent
    },
    {
        path: 'cuadrarcaja',
        canActivate:[AuthGuard],
        component: CuadrarCajaComponent
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class CajaRoutingModule {}