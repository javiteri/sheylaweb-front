import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatDatepickerModule} from '@angular/material/datepicker'
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS } from "@angular/material/core";

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
import { ApplicationProvider } from "src/app/providers/provider";
import { RouterModule } from "@angular/router";

import { PageVentasComponent } from "./page-ventas.component";
import { VentasRoutingModule } from "./ventas-routing.module";
import { MatLegacyDialogModule as MatDialogModule } from "@angular/material/legacy-dialog";
import { MatLegacyChipsModule as MatChipsModule } from "@angular/material/legacy-chips";
import { ListaVentasComponent } from './lista-ventas/lista-ventas.component'
import { PickDateAdapter, PICK_FORMATS} from "./adapter/DatePickerAdapter";
import { ResumenVentasComponent } from './resumen-ventas/resumen-ventas.component';
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { ImportarVentasDialogComponent } from './dialogs/importar-ventas-dialog/importar-ventas-dialog.component';
import { ListVentaItemService } from "./services/list-venta-items.service";

@NgModule({
    declarations: [
        PageVentasComponent,
        ListaVentasComponent,
        ResumenVentasComponent,
        ImportarVentasDialogComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        MatTooltipModule,
        VentasRoutingModule,
        MatSelectModule,
        RouterModule,
        MatCardModule,
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
        MatDialogModule,
        MatChipsModule,
        MatMenuModule
    ],
    providers: [
        LoadingService, ApplicationProvider,
        {provide: MatPaginatorIntl, useValue: CustomPaginator()},
        {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
        {provide: DateAdapter, useClass: PickDateAdapter},
        ListVentaItemService
      ]
})
export class VentasModule {

}