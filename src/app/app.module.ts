import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {LayoutModule} from '@angular/cdk/layout';
import { AppRoutingModule } from './app-routing.module';
import { ClientesComponentComponent } from './components/clientes-component/clientes-component.component';
import { PageInventarioComponent } from './pages/page-inventario/page-inventario.component';
import { PageVentasComponent } from './pages/page-ventas/page-ventas.component';
import { PageComprasComponent } from './pages/page-compras/page-compras.component';

@NgModule({
  declarations: [
    AppComponent,
    ClientesComponentComponent,
    PageInventarioComponent,
    PageVentasComponent,
    PageComprasComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    LayoutModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
