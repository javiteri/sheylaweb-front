import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/shared/guard";
import { CrearEditarPuntoEmisionComponent } from "./crear-editar-punto-emision/crear-editar-punto-emision.component";
import { PuntosEmisionComponent } from "./puntos-emision/puntos-emision.component";

const routes: Routes = [
  {
    path: '',
    canActivate:[AuthGuard],
    component: PuntosEmisionComponent
  },
  {
    path:'nuevo',
    canActivate:[AuthGuard],
    component: CrearEditarPuntoEmisionComponent
  },
  {
    path:'editar/:id',
    canActivate:[AuthGuard],
    component: CrearEditarPuntoEmisionComponent
  }
]

@NgModule({
  declarations: [],
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class PuntosEmisionRoutingModule {}