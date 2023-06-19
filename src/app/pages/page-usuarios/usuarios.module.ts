import { NgModule} from "@angular/core";
import { CommonModule } from "@angular/common";

import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table'
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyPaginatorIntl as MatPaginatorIntl } from '@angular/material/legacy-paginator';
import { CustomPaginator } from 'src/app/pages/page-clientes/CustomPaginator';
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatDatepickerModule} from '@angular/material/datepicker'
import { MatNativeDateModule } from "@angular/material/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { OverlayModule } from "@angular/cdk/overlay";
import { LoadingService } from "src/app/services/Loading.service";
import { UsuariosRoutingModule } from "./usuarios.routing.module";
import { UsuariosComponent } from "./usuarios/usuarios.component";
import { NuevoUsuarioComponent } from "./nuevo-usuario/nuevo-usuario.component";

@NgModule({
    declarations: [
        UsuariosComponent,
        NuevoUsuarioComponent
    ],
    imports: [
        CommonModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatCardModule,
        MatIconModule,
        MatTableModule,
        OverlayModule,
        MatPaginatorModule,
        UsuariosRoutingModule,
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
export class UsuariosModule {}