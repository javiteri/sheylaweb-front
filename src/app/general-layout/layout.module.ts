import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon'
import {MatDividerModule} from '@angular/material/divider'
import {MatButtonModule} from '@angular/material/button'
import {MatCardModule} from '@angular/material/card'
import {MatTableModule} from '@angular/material/table'
import {MatDialogModule} from '@angular/material/dialog'

import { LayoutComponent } from './layout.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { PageClientesComponent } from '../pages/page-clientes/page-clientes.component'

@NgModule({
  declarations: [
    LayoutComponent,
    PageClientesComponent
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
    MatDialogModule,
    LayoutRoutingModule
  ]
})
export class LayoutModule { }
