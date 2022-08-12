import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { PageClientesComponent } from '../../pages/page-clientes/page-clientes.component'
import { PageInventarioComponent } from '../../pages/page-inventario/page-inventario.component';
import { PageVentasComponent } from '../../pages/page-ventas/page-ventas.component';
import { PageComprasComponent } from '../../pages/page-compras/page-compras.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'clientes'
      },
      {
        path: 'clientes',
        component: PageClientesComponent
      },
      {
        path: 'inventario',
        component: PageInventarioComponent
      },
      {
        path: 'ventas',
        component: PageVentasComponent
      },
      {
        path: 'compras',
        component: PageComprasComponent
      },
      {
        path: 'infoempresa/:id/:ruc',
        loadChildren: () => import('../../pages/registro-empresa/registroempresa.module').then((m) => m.RegistroEmpresaModule)
      }
    ]
  }
]


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
