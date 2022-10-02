import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { ConfiguracionesRoutingModule } from "./configuraciones-routing.module";
import { ConfiguracionesComponent } from "./configuraciones.component";


@NgModule({
    declarations: [
        ConfiguracionesComponent
    ],
    imports: [
        CommonModule,
        MatSlideToggleModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatSelectModule,
        ConfiguracionesRoutingModule
    ],
    providers: []
})
export class ConfiguracionesModule{}