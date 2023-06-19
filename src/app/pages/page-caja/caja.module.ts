import { NgModule } from "@angular/core";
import { CajaRoutingModule } from "./caja-routing.module";
import { MovimientosCajaComponent } from './movimientos-caja/movimientos-caja.component';
import { CuadrarCajaComponent } from './cuadrar-caja/cuadrar-caja.component';
import { MatLegacyCardModule as MatCardModule } from "@angular/material/legacy-card";
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS } from "@angular/material/core";
import { MatLegacyTableModule as MatTableModule } from "@angular/material/legacy-table";
import { MatLegacyPaginatorIntl as MatPaginatorIntl, MatLegacyPaginatorModule as MatPaginatorModule } from "@angular/material/legacy-paginator";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { LoadingService } from "src/app/services/Loading.service";
import { ApplicationProvider } from "src/app/providers/provider";
import { CustomPaginator } from "../page-clientes/CustomPaginator";
import { PickDateAdapter, PICK_FORMATS } from "../page-ventas/adapter/DatePickerAdapter";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from "@angular/material/legacy-progress-spinner";

@NgModule({
    declarations: [
    MovimientosCajaComponent,
    CuadrarCajaComponent
  ],
    imports: [
        CommonModule,
        CajaRoutingModule,
        MatCardModule,
        MatSelectModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTableModule,
        MatPaginatorModule,
        MatIconModule,
        MatButtonModule,
        FormsModule
    ],
    providers: [LoadingService, ApplicationProvider,
      {provide: MatPaginatorIntl, useValue: CustomPaginator()},
      {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
      {provide: DateAdapter, useClass: PickDateAdapter}]
})
export class CajaModule{}