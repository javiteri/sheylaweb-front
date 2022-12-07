import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/shared/guard";
import { ListaComprasComponent } from "./lista-compras/lista-compras.component";
import { PageComprasComponent } from "./page-compras.component";
import { ResumenComprasComponent } from "./resumen-compras/resumen-compras.component";
import { XmlDocumentoElectronicoComponent } from "./xml-documento-electronico/xml-documento-electronico.component";


const routes: Routes = [
    {
        path: 'crearcompra',
        canActivate: [AuthGuard],
        component: PageComprasComponent
    },
    {
        path: 'crearcompra/:id',
        canActivate: [AuthGuard],
        component: PageComprasComponent
    },
    {
        path: 'listacompra',
        canActivate: [AuthGuard],
        component: ListaComprasComponent
    },
    {
        path: 'resumencompra',
        canActivate: [AuthGuard],
        component: ResumenComprasComponent
    },
    {
        path: 'xml-documento-electronico',
        canActivate: [AuthGuard],
        component: XmlDocumentoElectronicoComponent
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class ComprasRoutingModule {}