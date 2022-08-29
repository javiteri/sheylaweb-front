import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip'

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'
import { MatDatepickerModule} from '@angular/material/datepicker'
import { MatNativeDateModule } from "@angular/material/core";

import { OverlayModule } from "@angular/cdk/overlay";
import { LoadingService } from "src/app/services/Loading.service";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from "@angular/material/select";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginator } from 'src/app/pages/page-clientes/CustomPaginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { ApplicationProvider, EndPointProvider } from "src/app/providers/provider";
import { ProductosRoutingModule } from "./productos-routing.module";
import { RouterModule } from "@angular/router";
import { PageInventarioComponent } from "./page-inventario.component";
import { CrearEditarProductoComponent } from './crear-editar-producto/crear-editar-producto.component';

@NgModule({
    declarations: [
        PageInventarioComponent,
        CrearEditarProductoComponent
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
        OverlayModule
    ],
    providers: [LoadingService, ApplicationProvider, EndPointProvider,
        {provide: MatPaginatorIntl, useValue: CustomPaginator()}
      ]
})
export class ProductosModule {

}