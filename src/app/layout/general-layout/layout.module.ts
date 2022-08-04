import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon'
import {MatDividerModule} from '@angular/material/divider'
import {MatButtonModule} from '@angular/material/button'
import {MatCardModule} from '@angular/material/card'
import {MatTableModule} from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog'
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginator } from 'src/app/pages/page-clientes/CustomPaginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'

import { LayoutComponent } from './layout.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { PageClientesComponent } from '../../pages/page-clientes/page-clientes.component'
import { PageInventarioComponent } from '../../pages/page-inventario/page-inventario.component';
import { PageVentasComponent } from '../../pages/page-ventas/page-ventas.component';
import { PageComprasComponent } from '../../pages/page-compras/page-compras.component';
import { ClientesComponentComponent } from '../../components/clientes-component/clientes-component.component';

import { ApplicationProvider } from 'src/app/providers/provider';
import { EndPointProvider } from 'src/app/providers/endpoint/endpoint';


@NgModule({
  declarations: [
    LayoutComponent,
    PageClientesComponent,
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
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    LayoutRoutingModule,
    MatProgressSpinnerModule,
    HttpClientModule
  ],
  providers: [ApplicationProvider, EndPointProvider, 
    {provide: MatPaginatorIntl, useValue: CustomPaginator()}
  ]
})
export class LayoutModule { }
