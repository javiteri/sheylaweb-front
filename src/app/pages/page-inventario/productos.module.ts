import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'

import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatDatepickerModule} from '@angular/material/datepicker'
import { MatNativeDateModule } from "@angular/material/core";

import { OverlayModule } from "@angular/cdk/overlay";
import { LoadingService } from "src/app/services/Loading.service";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyPaginatorIntl as MatPaginatorIntl } from '@angular/material/legacy-paginator';
import { CustomPaginator } from 'src/app/pages/page-clientes/CustomPaginator';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { ProductosRoutingModule } from "./productos-routing.module";
import { RouterModule } from "@angular/router";
import { PageInventarioComponent } from "./page-inventario.component";
import { CrearEditarProductoComponent } from './crear-editar-producto/crear-editar-producto.component';
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { ImportarProductosDialogComponent } from './dialogs/importar-productos-dialog/importar-productos-dialog.component';
import { MatLegacyDialogModule as MatDialogModule } from "@angular/material/legacy-dialog";

@NgModule({
    declarations: [
        PageInventarioComponent,
        CrearEditarProductoComponent,
        ImportarProductosDialogComponent
    ],
    imports: [
        MatTooltipModule,
        CommonModule,
        MatCheckboxModule,
        MatAutocompleteModule,
        ProductosRoutingModule,
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
        MatMenuModule,
        MatDialogModule
    ],
    providers: [LoadingService,
        {provide: MatPaginatorIntl, useValue: CustomPaginator()}
      ]
})
export class ProductosModule {

}