import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PrintLayoutComponent } from "../pages-printer-strategy/print-layout/print-layout.component";
import { ReceiptComponent } from "../pages-printer-strategy/receipt/receipt.component";
import { DocumentosElectronicosComponent } from "./documentos-electronicos/documentos-electronicos.component";


const routes: Routes = [
    {
        path: '',
        component: DocumentosElectronicosComponent
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class DocumentosElectronicosRoutingModule {}