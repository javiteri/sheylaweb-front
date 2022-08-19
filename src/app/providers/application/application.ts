import { Injectable } from "@angular/core";
import { EndPointProvider } from "../endpoint/endpoint";

@Injectable()
export class ApplicationProvider {

  constructor(private coreEndPoint: EndPointProvider){}

  listaClientes(accesToken: any){
    return this.coreEndPoint.getListClienets(accesToken)
  }


  login(postData: any){
      return this.coreEndPoint.loginVerify(postData);
  }

  empresaByRucAndId(postData: any, accesToken: any){
    return this.coreEndPoint.empresaByRucAndId(postData, accesToken);
  }

  updateDatosEmpresa(postData: any, accesToken: any){
    return this.coreEndPoint.updateDatosEmpresa(postData, accesToken);
  }

  searchClienteByCiRuc(ciRuc: any){
    return this.coreEndPoint.searchClientByCiRuc(ciRuc);
  }

  //CLIENTES
  insertClienteToBD(postData: any, accessToken: any){
      return this.coreEndPoint.insertClienteToBD(postData, accessToken);
  }
  updateClienteToBD(postData: any, accessToken: any){
    return this.coreEndPoint.updateClienteToBD(postData, accessToken);
  }
  deleteClienteByIdEmp(idCliente: any, idEmp: any, accessToken: any){
    return this.coreEndPoint.deleteClienteByIdEmpToBD(idCliente, idEmp, accessToken);
  }

  getListClientesByIdEmp(idEmpresa: any, accessToken: any){
      return this.coreEndPoint.getListClientesByIdEmp(idEmpresa, accessToken);
  }
  getClienteByIdClienteIdEmp(idCliente: any, idEmpresa: any, accessToken: any){
      return this.coreEndPoint.getClienteByIdEmp(idCliente, idEmpresa, accessToken);
  }
}
