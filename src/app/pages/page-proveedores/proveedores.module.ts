import { NgModule} from "@angular/core";
import { CommonModule } from "@angular/common";

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from "@angular/material/select";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginator } from 'src/app/pages/page-clientes/CustomPaginator';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'
import { MatDatepickerModule} from '@angular/material/datepicker'
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS } from "@angular/material/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { OverlayModule } from "@angular/cdk/overlay";
import { LoadingService } from "src/app/services/Loading.service";

import { ProveedoresComponent } from "./proveedores/proveedores.component";
import { CreateEditProveedorComponent } from "./create-edit-proveedor/create-edit-proveedor.component";
import { ProveedoresRoutingModule } from "./proveedores.routing.module";
import { ImportarProveedoresDialogComponent } from './dialogs/importar-proveedores-dialog/importar-proveedores-dialog.component';
import { MatDialogModule } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { ListaProformasComponent } from './lista-proformas/lista-proformas.component';
import { CrearproformaComponent } from './crearproforma/crearproforma.component';
import { PickDateAdapter, PICK_FORMATS } from "../page-ventas/adapter/DatePickerAdapter";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
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