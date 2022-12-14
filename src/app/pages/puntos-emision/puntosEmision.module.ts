import { OverlayModule } from "@angular/cdk/overlay";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { ApplicationProvider, EndPointProvider } from "src/app/providers/provider";
import { LoadingService } from "src/app/services/Loading.service";
import { PuntosEmisionComponent } from './puntos-emision/puntos-emision.component';
import { CrearEditarPuntoEmisionComponent } from './crear-editar-punto-emision/crear-editar-punto-emision.component';
import { PuntosEmisionRoutingModule } from "./puntosEmision-routing.module";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";

@NgModule({
    declarations: [
      PuntosEmisionComponent,
      CrearEditarPuntoEmisionComponent
  ],
    imports: [
      MatTooltipModule,
      CommonModule,
      PuntosEmisionRoutingModule,
      RouterModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule,
      MatIconModule,
      MatCardModule,
      MatTableModule,
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
  export class PuntosEmisionModule {}