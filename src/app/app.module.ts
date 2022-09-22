import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material/dialog';

import { HttpClientModule } from '@angular/common/http';

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'
import { MatDatepickerModule} from '@angular/material/datepicker'
import { MatNativeDateModule } from "@angular/material/core";
import {MatCardModule} from '@angular/material/card'
import {MatIconModule} from '@angular/material/icon'
import { MatSelectModule } from "@angular/material/select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import {LayoutModule} from '@angular/cdk/layout';
import { AppRoutingModule } from './app-routing.module';
import { ConfirmDeleteDialogComponent } from './components/confirm-delete-dialog/confirm-delete-dialog.component';
import { AuthGuard } from './shared/guard';
import { ApplicationProvider, EndPointProvider } from './providers/provider';
import { OverlayModule } from '@angular/cdk/overlay';
import { LoadingService } from './services/Loading.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmDeleteDialogComponent
  ],
  imports: [
    OverlayModule,
    MatTooltipModule,
    FormsModule, 
    HttpClientModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    RouterModule,
    LayoutModule,
    AppRoutingModule,
    ToastrModule.forRoot()
  ],
  providers: [AuthGuard, ApplicationProvider, 
    EndPointProvider, LoadingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
