import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material/dialog';

import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './shared/guard';
import { ApplicationProvider, EndPointProvider } from './providers/provider';
import { LoadingService } from './services/Loading.service';
import { LayoutModule } from './pages/general-layout/layout.module';
import { RecuperarCuentaDialogComponent } from './components/recuperar-cuenta-dialog/recuperar-cuenta-dialog.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    LayoutModule,
    RouterModule,
    AppRoutingModule,
    ToastrModule.forRoot()
  ],
  providers: [AuthGuard, ApplicationProvider, 
    EndPointProvider, LoadingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
