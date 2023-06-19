import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';

import { PageClientesComponent } from "./lista-clientes/page-clientes.component";
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatDatepickerModule} from '@angular/material/datepicker'
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS } from "@angular/material/core";

import { OverlayModule } from "@angular/cdk/overlay";
import { LoadingService } from "src/app/services/Loading.service";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card'
import {MatIconModule} from '@angular/material/icon'
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table'
import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyPaginatorIntl as MatPaginatorIntl } from '@angular/material/legacy-paginator';
import { CustomPaginator } from 'src/app/pages/page-clientes/CustomPaginator';
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from '@angular/material/legacy-progress-spinner'
import { NuevoClienteComponent } from './nuevo-cliente/nuevo-cliente.component';
import { ClientesRoutingModule } from "./clientes-routing.module";
import { RouterModule } from "@angular/router";
import { CrearproformaComponent } from './crearproforma/crearproforma.component';
import { ListaProformasComponent } from './lista-proformas/lista-proformas.component';
import { PickDateAdapter, PICK_FORMATS } from "../page-ventas/adapter/DatePickerAdapter";
import { ImportarClientesDialogComponent } from './dialogs/importar-clientes-dialog/importar-clientes-dialog.component';
import { MatLegacyDialogModule as MatDialogModule } from "@angular/material/legacy-dialog";
import { ListVentaItemService } from "../page-ventas/services/list-venta-items.service";

@NgModule({
    declarations: [
        PageClientesComponent,
        NuevoClienteComponent,
        CrearproformaComponent,
        ListaProformasComponent,
        ImportarClientesDialogComponent
    ],
    imports: [
        MatTooltipModule,
        MatMenuModule,
        CommonModule,
        ClientesRoutingModule,
        MatSelectModule,
        RouterModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTableModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        FormsModule,
        ReactiveFormsModule,
        OverlayModule,
        MatDialogModule
    ],
    providers: [LoadingService,
        {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
        {provide: DateAdapter, useClass: PickDateAdapter},
        {provide: MatPaginatorIntl, useValue: CustomPaginator()},
        ListVentaItemService
      ]
})
export class ClientesModule {

}