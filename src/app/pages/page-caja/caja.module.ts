import { NgModule } from "@angular/core";
import { CajaRoutingModule } from "./caja-routing.module";
import { MovimientosCajaComponent } from './movimientos-caja/movimientos-caja.component';
import { CuadrarCajaComponent } from './cuadrar-caja/cuadrar-caja.component';
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS } from "@angular/material/core";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorIntl, MatPaginatorModule } from "@angular/material/paginator";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { LoadingService } from "src/app/services/Loading.service";
import { ApplicationProvider } from "src/app/providers/provider";
import { CustomPaginator } from "../page-clientes/CustomPaginator";
import { PickDateAdapter, PICK_FORMATS } from "../page-ventas/adapter/DatePickerAdapter";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";

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