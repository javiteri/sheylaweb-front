import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrintLayoutComponent } from './pages/pages-printer-strategy/print-layout/print-layout.component';
import { AuthGuard } from './shared/guard';


const routes: Routes = [
  
  {
    path: '',
    loadChildren: () => import('./pages/general-layout/layout.module').then((m) => m.LayoutModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginModule)
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {useHash: true}),
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
