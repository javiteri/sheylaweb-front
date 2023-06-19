import { NgModule} from "@angular/core";
import { CommonModule } from "@angular/common";

import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyPaginatorIntl as MatPaginatorIntl } from '@angular/material/legacy-paginator';
import { CustomPaginator } from 'src/app/pages/page-clientes/CustomPaginator';
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatDatepickerModule} from '@angular/material/datepicker'
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS } from "@angular/material/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { OverlayModule } from "@angular/cdk/overlay";
import { LoadingService } from "src/app/services/Loading.service";

import { ProveedoresComponent } from "./proveedores/proveedores.component";
import { CreateEditProveedorComponent } from "./create-edit-proveedor/create-edit-proveedor.component";
import { ProveedoresRoutingModule } from "./proveedores.routing.module";
import { ImportarProveedoresDialogComponent } from './dialogs/importar-proveedores-dialog/importar-proveedores-dialog.component';
import { MatLegacyDialogModule as MatDialogModule } from "@angular/material/legacy-dialog";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { ListaProformasComponent } from './lista-proformas/lista-proformas.component';
import { CrearproformaComponent } from './crearproforma/crearproforma.component';
import { PickDateAdapter, PICK_FORMATS } from "../page-ventas/adapter/DatePickerAdapter";
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from "@angular/material/legacy-progress-spinner";
import { ListCompraItemsService } from "../page-compras/services/list-compra-items.service";

@NgModule({
    declarations: [
        ProveedoresComponent,
        CreateEditProveedorComponent,
        ImportarProveedoresDialogComponent,
        ListaProformasComponent,
        CrearproformaComponent
    ],
    imports: [
        CommonModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatSelectModule,
        MatCardModule,
        MatIconModule,
        MatTableModule,
        OverlayModule,
        MatPaginatorModule,
        ProveedoresRoutingModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatMenuModule,
        MatProgressSpinnerModule
    ],
    providers: [
        LoadingService,
        {provide: MatPaginatorIntl, useValue: CustomPaginator()},
        {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
        {provide: DateAdapter, useClass: PickDateAdapter},
        ListCompraItemsService]
})
export class ProveedoresModule {}