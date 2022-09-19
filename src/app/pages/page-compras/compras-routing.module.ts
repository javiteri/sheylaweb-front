import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListaComprasComponent } from "./lista-compras/lista-compras.component";
import { PageComprasComponent } from "./page-compras.component";
import { ResumenComprasComponent } from "./resumen-compras/resumen-compras.component";


const routes: Routes = [
    {
        path: 'crearcompra',
        component: PageComprasComponent
    },
    {
        path: 'listacompra',
        component: ListaComprasComponent
    },
    {
        path: 'resumencompra',
        component: ResumenComprasComponent
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class ComprasRoutingModule {}