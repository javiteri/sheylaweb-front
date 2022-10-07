import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorIntl, MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CustomPaginator } from "../page-clientes/CustomPaginator";
import { PickDateAdapter, PICK_FORMATS } from "../page-ventas/adapter/DatePickerAdapter";
import { DocumentosElectronicosRoutingModule } from "./documentos-electronicos-routing.module";
import { DocumentosElectronicosComponent } from './documentos-electronicos/documentos-electronicos.component';

@NgModule({
    declarations: [    
        DocumentosElectronicosComponent
    ],
    imports: [
        CommonModule,
        DocumentosElectronicosRoutingModule,
        MatCardModule,
        MatInputModule,
        MatTableModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        FormsModule,
        MatIconModule,
        MatSelectModule,
        MatPaginatorModule,
        MatTooltipModule
    ],
    providers: [{provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
        {provide: DateAdapter, useClass: PickDateAdapter},
        {provide: MatPaginatorIntl, useValue: CustomPaginator()}]
})
export class DocumentosElectronicosModule{

}