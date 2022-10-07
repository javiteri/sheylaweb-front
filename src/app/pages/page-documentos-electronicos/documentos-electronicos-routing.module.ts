import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
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