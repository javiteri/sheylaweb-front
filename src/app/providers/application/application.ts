import { Injectable } from "@angular/core";
import { EndPointProvider } from "../endpoint/endpoint";

@Injectable()
export class ApplicationProvider {

  constructor(private coreEndPoint: EndPointProvider){}

  listaClientes(accesToken: any){
    return this.coreEndPoint.getListClienets(accesToken)
  }



}
