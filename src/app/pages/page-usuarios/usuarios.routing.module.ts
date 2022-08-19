import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NuevoUsuarioComponent } from "./nuevo-usuario/nuevo-usuario.component";
import { UsuariosComponent } from "./usuarios/usuarios.component";


const routes: Routes = [
    {
        path: '',
        component: UsuariosComponent
    },
    {
        path: 'nuevo',
        component: NuevoUsuarioComponent
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class UsuariosRoutingModule {}