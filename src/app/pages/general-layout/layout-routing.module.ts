import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { ConfiguracionesComponent } from '../configuraciones/configuraciones.component';
import { AuthGuard } from 'src/app/shared/guard/auth.guard';
import { PrintLayoutComponent } from '../pages-printer-strategy/print-layout/print-layout.component';
import { ReceiptComponent } from '../pages-printer-strategy/receipt/receipt.component';
import { ReceiptProformaComponent } from '../pages-printer-strategy/receipt-proforma/receipt-proforma.component';
import { PageCheckoutComponent } from '../page-checkout/page-checkout.component';
import { RedirectCheckoutComponent } from '../page-checkout/redirect-checkout/redirect-checkout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    //canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        canActivate:[AuthGuard],
        loadChildren: () => import('../page-dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'clientes',
        loadChildren: () => import('../page-clientes/clientes.module').then((m) => m.ClientesModule)
      },
      {
        path: 'inventario',
        canActivate:[AuthGuard],
        loadChildren: () => import('../page-inventario/productos.module').then((m) => m.ProductosModule)
      },
      {
        path: 'ventas',
        loadChildren: () => import('../page-ventas/ventas.module').then((m) => m.VentasModule)
      },
      {
        path: 'proveedores',
        canActivate:[AuthGuard],
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
        canActivate:[AuthGuard],
        loadChildren: () => import('../registro-empresa/registroempresa.module').then((m) => m.RegistroEmpresaModule)
      },
      {
        path: 'usuarios',
        canActivate:[AuthGuard],
        loadChildren: () => import('../page-usuarios/usuarios.module').then((m) => m.UsuariosModule)
      },
      {
        path: 'documentos-electronicos',
        canActivate:[AuthGuard],
        loadChildren: () => import('../page-documentos-electronicos/documentoselectronicos.module').then((m) => m.DocumentosElectronicosModule)
      },
      {
        path: 'configuracion',
        canActivate:[AuthGuard],
        loadChildren: () => import('../configuraciones/configuraciones.module').then((m) => m.ConfiguracionesModule)
      },
      {
        path: 'establecimientos',
        loadChildren: () => import('../puntos-emision/puntosEmision.module').then((m) => m.PuntosEmisionModule)
      },
      {
        path: 'checkout/:planselect',
        component: PageCheckoutComponent
      },
      {
        path: 'payment/final',
        component: RedirectCheckoutComponent
      },
      { path: 'print',
        outlet: 'print',
        component: PrintLayoutComponent,
        children: [
          { path: 'receipt/:id/:reimpresion/:isLogo', component: ReceiptComponent },
          {path: 'receipt-proforma/:id', component: ReceiptProformaComponent}
        ]
      },
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
