import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon'
import {MatDividerModule} from '@angular/material/divider'
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button'
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

import {MatLegacySlideToggleModule as MatSlideToggleModule} from '@angular/material/legacy-slide-toggle';

import { LayoutComponent } from './layout.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { BuscarClienteDialogComponent } from 'src/app/components/buscar-cliente-dialog/buscar-cliente-dialog.component';
import { BuscarProductoDialogComponent } from 'src/app/components/buscar-producto-dialog/buscar-producto-dialog.component';
import { CantidadProductoDialogComponent } from 'src/app/components/cantidad-producto-dialog/cantidad-producto-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrearClienteDialogComponent } from 'src/app/components/crear-cliente-dialog/crear-cliente-dialog.component';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { CrearProveedorDialogComponent } from 'src/app/components/crear-proveedor-dialog/crear-proveedor-dialog.component';
import { BuscarProveedorDialogComponent } from 'src/app/components/buscar-proveedor-dialog/buscar-proveedor-dialog.component';
import { NuevoIngresoCajaDialogComponent } from 'src/app/components/nuevo-ingreso-caja-dialog/nuevo-ingreso-caja-dialog.component';
import { NuevoEgresoCajaDialogComponent } from 'src/app/components/nuevo-egreso-caja-dialog/nuevo-egreso-caja-dialog.component';
import { PickDateAdapter, PICK_FORMATS } from '../page-ventas/adapter/DatePickerAdapter';
import { ConfirmDeleteDialogComponent } from 'src/app/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { CrearNuevaEmpresaDialogComponent } from 'src/app/components/crear-nueva-empresa-dialog/crear-nueva-empresa-dialog.component';
import { RecuperarCuentaDialogComponent } from 'src/app/components/recuperar-cuenta-dialog/recuperar-cuenta-dialog.component';
import { PrintLayoutComponent } from '../pages-printer-strategy/print-layout/print-layout.component';
import { ReceiptComponent } from '../pages-printer-strategy/receipt/receipt.component';
import { ReceiptProformaComponent } from '../pages-printer-strategy/receipt-proforma/receipt-proforma.component';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { FormPlanesComponent } from 'src/app/components/form-planes/form-planes.component';
import { PageCheckoutComponent } from '../page-checkout/page-checkout.component';

@NgModule({
  declarations: [
    LayoutComponent,
    BuscarClienteDialogComponent,
    BuscarProductoDialogComponent,
    CantidadProductoDialogComponent,
    CrearClienteDialogComponent,
    CrearNuevaEmpresaDialogComponent,
    CrearProveedorDialogComponent,
    BuscarProveedorDialogComponent,
    NuevoIngresoCajaDialogComponent,
    NuevoEgresoCajaDialogComponent,
    ConfirmDeleteDialogComponent,
    RecuperarCuentaDialogComponent,
    FormPlanesComponent,
    PrintLayoutComponent,
    ReceiptComponent,
    ReceiptProformaComponent,
    PageCheckoutComponent
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
    FormsModule,
    MatTooltipModule
  ],providers: [
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
    {provide: DateAdapter, useClass: PickDateAdapter}]
})
export class LayoutModule { }
