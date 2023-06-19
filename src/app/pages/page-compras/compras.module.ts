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


import { MatLegacyDialogModule as MatDialogModule } from "@angular/material/legacy-dialog";
import { PickDateAdapter, PICK_FORMATS} from "../page-ventas/adapter/DatePickerAdapter";
import { PageComprasComponent } from "./page-compras.component";
import { ComprasRoutingModule } from "./compras-routing.module";
import { ListaComprasComponent } from './lista-compras/lista-compras.component';
import { ResumenComprasComponent } from './resumen-compras/resumen-compras.component';
import { XmlDocumentoElectronicoComponent } from './xml-documento-electronico/xml-documento-electronico.component';

import {SriBuscarDocumentoXmlComponent} from '../../components/sri-buscar-documento-xml/sri-buscar-documento-xml.component';
import { ListCompraItemsService } from "./services/list-compra-items.service";
import { BuscarProductoCompraDialogComponent } from "src/app/components/buscar-producto-compra-dialog/buscar-producto-compra-dialog.component";

@NgModule({
    declarations: [
        PageComprasComponent,
        ListaComprasComponent,
        ResumenComprasComponent,
        XmlDocumentoElectronicoComponent,
        SriBuscarDocumentoXmlComponent,
        BuscarProductoCompraDialogComponent
    ],
    imports: [
        CommonModule,
        ComprasRoutingModule,
        MatTooltipModule,
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
        MatDialogModule
    ],
    providers: [LoadingService, ApplicationProvider,
        {provide: MatPaginatorIntl, useValue: CustomPaginator()},
        {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
        {provide: DateAdapter, useClass: PickDateAdapter},
        ListCompraItemsService
      ]
})
export class ComprasModule {}