import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip'

import { PageClientesComponent } from "./lista-clientes/page-clientes.component";

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'
import { MatDatepickerModule} from '@angular/material/datepicker'
import { MatNativeDateModule } from "@angular/material/core";

import { OverlayModule } from "@angular/cdk/overlay";
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
import { NuevoClienteComponent } from './nuevo-cliente/nuevo-cliente.component';
import { ClientesRoutingModule } from "./clientes-routing.module";
import { RouterModule } from "@angular/router";
import { CrearproformaComponent } from './crearproforma/crearproforma.component';
import { ListaProformasComponent } from './lista-proformas/lista-proformas.component';

@NgModule({
    declarations: [
        PageClientesComponent,
        NuevoClienteComponent,
        CrearproformaComponent,
        ListaProformasComponent
    ],
    imports: [
        MatTooltipModule,
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
        OverlayModule
    ],
    providers: [LoadingService,
        {provide: MatPaginatorIntl, useValue: CustomPaginator()}
      ]
})
export class ClientesModule {

}