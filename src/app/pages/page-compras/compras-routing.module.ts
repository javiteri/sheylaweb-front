import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListaComprasComponent } from "./lista-compras/lista-compras.component";
import { PageComprasComponent } from "./page-compras.component";
import { ResumenComprasComponent } from "./resumen-compras/resumen-compras.component";
import { XmlDocumentoElectronicoComponent } from "./xml-documento-electronico/xml-documento-electronico.component";


const routes: Routes = [
    {
        path: 'crearcompra',
        component: PageComprasComponent
    },
    {
        path: 'crearcompra/:id',
        component: PageComprasComponent
    },
    {
        path: 'listacompra',
        component: ListaComprasComponent
    },
    {
        path: 'resumencompra',
        component: ResumenComprasComponent
    },
    {
        path: 'xml-documento-electronico',
        component: XmlDocumentoElectronicoComponent
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class ComprasRoutingModule {}