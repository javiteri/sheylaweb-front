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

  //USUARIOS
  getUsuariosByIdEmp(idEmp: any, accessToken: any){
    return this.coreEndPoint.getUsuariosByIdEmp(idEmp, accessToken);
  }
  insertUsuarioToBD(postData: any, accessToken: any){
    return this.coreEndPoint.insertUsuarioToBD(postData, accessToken);
  }
  getUsuarioById(idUsuario: any, idEmpresa: any, accessToken: any){
    return this.coreEndPoint.getUsuarioById(idUsuario, idEmpresa, accessToken);
  }
  updateUsuarioToBD(postData: any, accessToken: any){
    return this.coreEndPoint.updateUsuarioToBD(postData, accessToken);
  }
  deleteUsuarioByIdEmp(idUser: any, idEmp: any, accessToken: any){
    return this.coreEndPoint.deleteUsuarioByIdEmpToBD(idUser, idEmp, accessToken);
  }

  // PROVEEDORES
  getListProveedoresByIdEmp(idEmpresa: any, accessToken: any){
    return this.coreEndPoint.getListProveedoresByIdEmp(idEmpresa, accessToken);
  }
  getProveedorByIdProvIdEmp(idProv: any, idEmpresa: any, accessToken: any){
    return this.coreEndPoint.getProveedorByIdEmp(idProv, idEmpresa, accessToken);
  }
  insertProveedorToBD(postData: any, accessToken: any){
    return this.coreEndPoint.insertProveedorToBD(postData, accessToken);
  }
  updateProveedorToBD(postData: any, accessToken: any){
    return this.coreEndPoint.updateProveedorToBD(postData, accessToken);
  }
  deleteProveedorByIdEmp(idCliente: any, idEmp: any, accessToken: any){
    return this.coreEndPoint.deleteProveedorByIdEmpToBD(idCliente, idEmp, accessToken);
  }

  // PRODUCTOS
  getListProductosByIdEmp(idEmpresa: any, accessToken: any){
    return this.coreEndPoint.getListProductosByIdEmp(idEmpresa, accessToken);
  }
}
