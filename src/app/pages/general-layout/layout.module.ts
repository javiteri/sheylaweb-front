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
import {MatTableModule} from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';

import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import { LayoutComponent } from './layout.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { BuscarClienteDialogComponent } from 'src/app/components/buscar-cliente-dialog/buscar-cliente-dialog.component';
import { BuscarProductoDialogComponent } from 'src/app/components/buscar-producto-dialog/buscar-producto-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrearClienteDialogComponent } from 'src/app/components/crear-cliente-dialog/crear-cliente-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CrearProveedorDialogComponent } from 'src/app/components/crear-proveedor-dialog/crear-proveedor-dialog.component';
import { BuscarProveedorDialogComponent } from 'src/app/components/buscar-proveedor-dialog/buscar-proveedor-dialog.component';
import { BuscarProductoCompraDialogComponent } from 'src/app/components/buscar-producto-compra-dialog/buscar-producto-compra-dialog.component';
import { NuevoIngresoCajaDialogComponent } from 'src/app/components/nuevo-ingreso-caja-dialog/nuevo-ingreso-caja-dialog.component';
import { NuevoEgresoCajaDialogComponent } from 'src/app/components/nuevo-egreso-caja-dialog/nuevo-egreso-caja-dialog.component';
import { PickDateAdapter, PICK_FORMATS } from '../page-ventas/adapter/DatePickerAdapter';
import { ConfirmDeleteDialogComponent } from 'src/app/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { CrearNuevaEmpresaDialogComponent } from 'src/app/components/crear-nueva-empresa-dialog/crear-nueva-empresa-dialog.component';


@NgModule({
  declarations: [
    LayoutComponent,
    BuscarClienteDialogComponent,
    BuscarProductoDialogComponent,
    BuscarProductoCompraDialogComponent,
    CrearClienteDialogComponent,
    CrearNuevaEmpresaDialogComponent,
    CrearProveedorDialogComponent,
    BuscarProveedorDialogComponent,
    NuevoIngresoCajaDialogComponent,
    NuevoEgresoCajaDialogComponent,
    ConfirmDeleteDialogComponent
  ],
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSelectModule,
    MatDialogModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSidenavModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatCardModule,
    LayoutRoutingModule,
    HttpClientModule,
    MatListModule,
    FormsModule
  ],providers: [
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
    {provide: DateAdapter, useClass: PickDateAdapter}]
})
export class LayoutModule { }
