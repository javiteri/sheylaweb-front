import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { ConfiguracionesComponent } from '../configuraciones/configuraciones.component';
import { AuthGuard } from 'src/app/shared/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../page-dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'clientes',
        loadChildren: () => import('../page-clientes/clientes.module').then((m) => m.ClientesModule)
      },
      {
        path: 'inventario',
        loadChildren: () => import('../page-inventario/productos.module').then((m) => m.ProductosModule)
      },
      {
        path: 'ventas',
        loadChildren: () => import('../page-ventas/ventas.module').then((m) => m.VentasModule)
      },
      {
        path: 'proveedores',
        loadChildren: () => import('../page-proveedores/proveedores.module').then((m) => m.ProveedoresModule)
      },
      {
        path: 'compras',
        loadChildren: () => import('../page-compras/compras.module').then((m) => m.ComprasModule)
      },
      { 
        path: 'caja',
        loadChildren: () => import('../page-caja/caja.module').then((m) => m.CajaModule)
      },
      {
        path: 'infoempresa',
        loadChildren: () => import('../registro-empresa/registroempresa.module').then((m) => m.RegistroEmpresaModule)
      },
      {
        path: 'usuarios',
        loadChildren: () => import('../page-usuarios/usuarios.module').then((m) => m.UsuariosModule)
      },
      {
        path: 'configuracion',
        loadChildren: () => import('../configuraciones/configuraciones.module').then((m) => m.ConfiguracionesModule)
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
