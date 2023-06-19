import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatLegacyCardModule as MatCardModule } from "@angular/material/legacy-card";
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { MatLegacyPaginatorIntl as MatPaginatorIntl, MatLegacyPaginatorModule as MatPaginatorModule } from "@angular/material/legacy-paginator";
import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
import { MatLegacyTableModule as MatTableModule } from "@angular/material/legacy-table";
import { MatLegacyTooltipDefaultOptions as MatTooltipDefaultOptions, MatLegacyTooltipModule as MatTooltipModule, MAT_LEGACY_TOOLTIP_DEFAULT_OPTIONS as MAT_TOOLTIP_DEFAULT_OPTIONS } from "@angular/material/legacy-tooltip";
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
    providers: [
        {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
        {provide: DateAdapter, useClass: PickDateAdapter},
        {provide: MatPaginatorIntl, useValue: CustomPaginator()}
    ]
})
export class DocumentosElectronicosModule{

}