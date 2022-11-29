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


import { MatDialogModule } from "@angular/material/dialog";
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