import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login.component';
import { MatLegacyCardModule as MatCardModule } from "@angular/material/legacy-card";
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatIconModule } from "@angular/material/icon";
import { OverlayModule } from "@angular/cdk/overlay";
import { LoadingService } from "src/app/services/Loading.service";
import { LoginRoutingModule } from "./login-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ApplicationProvider, EndPointProvider } from "../../providers/provider";
import { DialogPoliticasPrivacidadComponent } from "src/app/components/dialogs/dialog-politicas-privacidad/dialog-politicas-privacidad.component";
import { DialogTerminosCondicionesComponent } from "src/app/components/dialogs/dialog-terminos-condiciones/dialog-terminos-condiciones.component";
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

@NgModule({
    declarations: [
      LoginComponent,
      DialogPoliticasPrivacidadComponent,
      DialogTerminosCondicionesComponent
  ],
    imports: [
        OverlayModule,  
        CommonModule,
        HttpClientModule,
        MatCardModule,
        MatDialogModule,
        RouterModule,
        LoginRoutingModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [LoadingService, ApplicationProvider, EndPointProvider]
})
export class LoginModule { }
