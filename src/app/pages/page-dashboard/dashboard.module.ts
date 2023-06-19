import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatLegacyCardModule as MatCardModule } from "@angular/material/legacy-card";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
    declarations: [    
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatCardModule
  ],
  providers: []
})
export class DashboardModule{}