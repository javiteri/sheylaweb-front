import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CuadrarCajaComponent } from "./cuadrar-caja/cuadrar-caja.component";
import { MovimientosCajaComponent } from "./movimientos-caja/movimientos-caja.component";

const routes: Routes = [
    {
        path: 'movimientoscaja',
        component: MovimientosCajaComponent
    },
    {
        path: 'cuadrarcaja',
        component: CuadrarCajaComponent
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class CajaRoutingModule {}