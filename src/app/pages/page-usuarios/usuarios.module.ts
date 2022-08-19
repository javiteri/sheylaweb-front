import { NgModule } from "@angular/core";

import {MatCardModule} from '@angular/material/card'
import {MatIconModule} from '@angular/material/icon'
import {MatTableModule} from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginator } from 'src/app/pages/page-clientes/CustomPaginator';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'
import { MatDatepickerModule} from '@angular/material/datepicker'
import { MatNativeDateModule } from "@angular/material/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ApplicationProvider, EndPointProvider } from "src/app/providers/provider";

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
    providers: [LoadingService, ApplicationProvider, EndPointProvider,
                {provide: MatPaginatorIntl, useValue: CustomPaginator()}]
})
export class UsuariosModule {}