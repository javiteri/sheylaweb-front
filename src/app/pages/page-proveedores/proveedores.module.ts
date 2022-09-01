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
import { MatNativeDateModule } from "@angular/material/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { OverlayModule } from "@angular/cdk/overlay";
import { LoadingService } from "src/app/services/Loading.service";

import { ProveedoresComponent } from "./proveedores/proveedores.component";
import { CreateEditProveedorComponent } from "./create-edit-proveedor/create-edit-proveedor.component";
import { ProveedoresRoutingModule } from "./proveedores.routing.module";

@NgModule({
    declarations: [
        ProveedoresComponent,
        CreateEditProveedorComponent
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
        ReactiveFormsModule
    ],
    providers: [LoadingService,
                {provide: MatPaginatorIntl, useValue: CustomPaginator()}]
})
export class ProveedoresModule {}