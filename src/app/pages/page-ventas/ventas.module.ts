import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'
import { MatDatepickerModule} from '@angular/material/datepicker'
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS } from "@angular/material/core";

import { LoadingService } from "src/app/services/Loading.service";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import {MatCardModule} from '@angular/material/card'
import {MatIconModule} from '@angular/material/icon'
import {MatTableModule} from '@angular/material/table'
import { MatSelectModule } from "@angular/material/select";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginator } from 'src/app/pages/page-clientes/CustomPaginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import { ApplicationProvider } from "src/app/providers/provider";
import { RouterModule } from "@angular/router";

import { PageVentasComponent } from "./page-ventas.component";
import { VentasRoutingModule } from "./ventas-routing.module";
import { MatDialogModule } from "@angular/material/dialog";
import { MatChipsModule } from "@angular/material/chips";
import { ListaVentasComponent } from './lista-ventas/lista-ventas.component'
import { PickDateAdapter, PICK_FORMATS} from "./adapter/DatePickerAdapter";
import { ResumenVentasComponent } from './resumen-ventas/resumen-ventas.component';
import { PrintLayoutComponent } from "../pages-printer-strategy/print-layout/print-layout.component";
import { ReceiptComponent } from "../pages-printer-strategy/receipt/receipt.component";
import { MatMenuModule } from "@angular/material/menu";

@NgModule({
    declarations: [
        PageVentasComponent,
        ListaVentasComponent,
        ResumenVentasComponent
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
    providers: [LoadingService, ApplicationProvider,
        {provide: MatPaginatorIntl, useValue: CustomPaginator()},
        {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
        {provide: DateAdapter, useClass: PickDateAdapter}
      ]
})
export class VentasModule {

}