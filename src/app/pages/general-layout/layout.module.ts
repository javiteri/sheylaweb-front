import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon'
import {MatDividerModule} from '@angular/material/divider'
import {MatButtonModule} from '@angular/material/button'
import {MatCardModule} from '@angular/material/card'
import { MatListModule } from '@angular/material/list';

import { LayoutComponent } from './layout.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { PageInventarioComponent } from '../page-inventario/page-inventario.component';
import { PageVentasComponent } from '../page-ventas/page-ventas.component';
import { PageComprasComponent } from '../page-compras/page-compras.component';
import { ClientesComponentComponent } from '../../components/clientes-component/clientes-component.component';



@NgModule({
  declarations: [
    LayoutComponent,
    PageInventarioComponent,
    PageVentasComponent,
    PageComprasComponent,
    ClientesComponentComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatCardModule,
    LayoutRoutingModule,
    HttpClientModule,
    MatListModule
  ]
})
export class LayoutModule { }
