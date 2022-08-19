import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { PageClientesComponent } from '../page-clientes/page-clientes.component'
import { PageInventarioComponent } from '../page-inventario/page-inventario.component';
import { PageVentasComponent } from '../page-ventas/page-ventas.component';
import { PageComprasComponent } from '../page-compras/page-compras.component';

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
        loadChildren: () => import('../page-clientes/clientes.module').then((m) => m.ClientesModule)
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
        path: 'infoempresa',
        loadChildren: () => import('../registro-empresa/registroempresa.module').then((m) => m.RegistroEmpresaModule)
      },
      {
        path: 'usuarios',
        loadChildren: () => import('../page-usuarios/usuarios.module').then((m) => m.UsuariosModule)
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
