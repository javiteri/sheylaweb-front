import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'
import { MatDatepickerModule} from '@angular/material/datepicker'
import { MatNativeDateModule } from "@angular/material/core";

import { OverlayModule } from "@angular/cdk/overlay";
import { LoadingService } from "src/app/services/loading.service";

import { RegistroEmpresaRoutingModule } from "./registro-empresa-routing.module";
import { ApplicationProvider, EndPointProvider } from "../../providers/provider";
import { RegistroEmpresaComponent } from "./registro-empresa.component";


@NgModule({
  declarations: [
    RegistroEmpresaComponent
  ],
  imports: [
    RegistroEmpresaRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    OverlayModule
  ],
  exports: [],
  providers: [LoadingService, ApplicationProvider, EndPointProvider]
})
export class RegistroEmpresaModule {}
