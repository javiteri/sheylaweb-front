import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroEmpresaComponent } from './registro-empresa/registro-empresa.component';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./layout/general-layout/layout.module').then((m) => m.LayoutModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then((m) => m.LoginModule)
  },
  {
    path: 'registroempresa',
    loadChildren: () => import('./registro-empresa/registroempresa.module').then((m) => m.RegistroEmpresaModule)
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
