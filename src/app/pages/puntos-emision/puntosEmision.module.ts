import { OverlayModule } from "@angular/cdk/overlay";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatLegacyCardModule as MatCardModule } from "@angular/material/legacy-card";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { RouterModule } from "@angular/router";
import { ApplicationProvider, EndPointProvider } from "src/app/providers/provider";
import { LoadingService } from "src/app/services/Loading.service";
import { PuntosEmisionComponent } from './puntos-emision/puntos-emision.component';
import { CrearEditarPuntoEmisionComponent } from './crear-editar-punto-emision/crear-editar-punto-emision.component';
import { PuntosEmisionRoutingModule } from "./puntosEmision-routing.module";
import { MatLegacyTableModule as MatTableModule } from "@angular/material/legacy-table";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";

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