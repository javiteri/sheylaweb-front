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

  // EMPRESAS
  empresaByRucAndId(postData: any, accesToken: any){
    return this.coreEndPoint.empresaByRucAndId(postData, accesToken);
  }

  updateDatosEmpresa(postData: any, accesToken: any){
    return this.coreEndPoint.updateDatosEmpresa(postData, accesToken);
  }

  crearNuevaEmpresaByRuc(ruc: any){
    return this.coreEndPoint.crearNuevaEmpresaByRuc(ruc);
  }

  getImagenLogoByRucEmp(rucEmp: any, accesToken: any){
    return this.coreEndPoint.getLogoEmpresaByRuc(rucEmp, accesToken);
  }

  //CLIENTES
  searchClienteByCiRuc(ciRuc: any){
    return this.coreEndPoint.searchClientByCiRuc(ciRuc);
  }
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
  searchClientesByIdEmpText(idEmpresa: any, textSearch: any, accessToken: any){
      return this.coreEndPoint.searchClientesByIdEmpText(idEmpresa, textSearch, accessToken);
  }
  getExcelListClientes(idEmpresa: any, accesToken: any){
    return this.coreEndPoint.getClientesExcelById(idEmpresa,accesToken);
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
  searchUsuariosByIdEmpText(idEmpresa: any, textSearch: any, accessToken: any){
    return this.coreEndPoint.searchUsuariosByIdEmpText(idEmpresa, textSearch, accessToken);
  }
  getExcelListUsuarios(idEmpresa: any, accesToken: any){
    return this.coreEndPoint.getUsuariosExcelById(idEmpresa,accesToken);
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
  searchProveedoresByIdEmpText(idEmpresa: any, textSearch: any, accessToken: any){
    return this.coreEndPoint.searchProveedoresByIdEmpText(idEmpresa, textSearch, accessToken);
  }
  getExcelListProveedores(idEmpresa: any, accesToken: any){
    return this.coreEndPoint.getProveedoresExcelById(idEmpresa,accesToken);
  }

  // PRODUCTOS
  getListProductosByIdEmp(idEmpresa: any, accessToken: any){
    return this.coreEndPoint.getListProductosByIdEmp(idEmpresa, accessToken);
  }
  getListProductosByIdEmpActivo(idEmpresa: any, accessToken: any){
    return this.coreEndPoint.getListProductosByIdEmpActivo(idEmpresa, accessToken);
  }
  getProductoByIdEmp(idProducto: any, idEmpresa: any, accessToken: any){
    return this.coreEndPoint.getProductoByIdEmp(idProducto, idEmpresa, accessToken);
  }
  insertProductoToBD(postData: any, accessToken: any){
    return this.coreEndPoint.insertProductoToBD(postData, accessToken);
  }
  updateProductoToBD(postData: any, accessToken: any){
    return this.coreEndPoint.updateProductoToBD(postData, accessToken);
  }
  deleteProductoByIdEmp(idCliente: any, idEmp: any, accessToken: any){
    return this.coreEndPoint.deleteProductoByIdEmpToBD(idCliente, idEmp, accessToken);
  }

  getCategoriasProductosByIdEmp(idEmpresa: any, accessToken: any){
    return this.coreEndPoint.getCategoriasByIdEmp(idEmpresa, accessToken);
  }
  getMarcasProductosByIdEmp(idEmpresa: any, accessToken: any){
    return this.coreEndPoint.getMarcasByIdEmp(idEmpresa, accessToken);
  }
  searchProductosByIdEmpText(idEmpresa: any, textSearch: any, accessToken: any){
    return this.coreEndPoint.searchProductosByIdEmpText(idEmpresa, textSearch, accessToken);
  }
  searchProductosByIdEmpTextActivo(idEmpresa: any, textSearch: any, accessToken: any){
    return this.coreEndPoint.searchProductosByIdEmpTextActivo(idEmpresa, textSearch, accessToken);
  }
  getExcelListProductos(idEmpresa: any, accesToken: any){
    return this.coreEndPoint.getProductosExcelById(idEmpresa,accesToken);
  }

  //VENTAS FACTURA, TICKET, OTROS
  insertVentaFacturaToBD(postData: any, accessToken: any){
    return this.coreEndPoint.insertVentaToBD(postData, accessToken);
  }
  getListaVentasByIdEmp(idEmpresa: any, nombreCi: any, noDoc: any, fechaIni: any, 
    fechaFin: any, accessToken: any){
    return this.coreEndPoint.getListaVentasByIdEmp(idEmpresa,nombreCi,noDoc,fechaIni,fechaFin,accessToken);
  }
  getResumenVentasByIdEmp(idEmpresa: any, nombreCi: any, noDoc: any, fechaIni: any, 
                        fechaFin: any, accessToken: any){
    return this.coreEndPoint.getListaResumenVentasByIdEmp(idEmpresa,nombreCi,noDoc,fechaIni,fechaFin,accessToken);
  }
  getConsumidorFinalOrCreate(idEmpresa: any, accessToken: any){
    return this.coreEndPoint.getConsumidorFinalByIdEmp(idEmpresa, accessToken);
  }
  updateEstadoVentaByIdEmp(idEmpresa: any, idVenta: any, estado: any, accessToken: any){
    return this.coreEndPoint.updateEstadoVentaToBD({idEmpresa,idVenta,estado},accessToken);
  }
  deleteVentaByIdEmp(idEmpresa: any, idVenta: any, estado: any, accessToken: any){
    return this.coreEndPoint.deleteVentaToBD({idEmpresa,idVenta,estado},accessToken);
  }
  getNextNumeroSecuencialByIdEmp(idEmp: any, tipoDoc: any, fac001: any, fac002: any, accessToken: any){
    return this.coreEndPoint.getNextNumeroSecuencialByIdEmp(idEmp,tipoDoc,fac001,fac002,accessToken);
  }
  getDataByIdVenta(idVenta: any, idEmp: any, accessToken: any){
    return this.coreEndPoint.getDataByIdVenta(idVenta, idEmp,accessToken);
  }
  getExcelListaVentas(idEmpresa: any, nombreCi: any, noDoc: any, fechaIni: any, 
                      fechaFin: any,accesToken: any){
    return this.coreEndPoint.getListaVentasExcelByIdEmp(idEmpresa,nombreCi,noDoc,fechaIni,fechaFin,accesToken);
  }
  getExcelListaResumenVentas(idEmpresa: any, nombreCi: any, noDoc: any, fechaIni: any, 
    fechaFin: any,accesToken: any){
    return this.coreEndPoint.getListaResumenVentasExcelByIdEmp(idEmpresa,nombreCi,noDoc,fechaIni,fechaFin,accesToken);
}

  //COMPRAS
  insertCompraFacturaToBD(postData: any, accessToken: any){
    return this.coreEndPoint.insertCompraToBD(postData, accessToken);
  }
  getListaComprasByIdEmp(idEmpresa: any, nombreCi: any, noDoc: any, fechaIni: any, 
    fechaFin: any, accessToken: any){
    return this.coreEndPoint.getListaComprasByIdEmp(idEmpresa,nombreCi,noDoc,fechaIni,fechaFin,accessToken);
  }
  getResumenComprasByIdEmp(idEmpresa: any, nombreCi: any, noDoc: any, fechaIni: any, 
    fechaFin: any, accessToken: any){
    return this.coreEndPoint.getListaResumenComprasByIdEmp(idEmpresa,nombreCi,noDoc,fechaIni,fechaFin,accessToken);
  }
  getProveedorGenericoOrCreate(idEmpresa: any, accessToken: any){
    return this.coreEndPoint.getProveedorGenericoByIdEmp(idEmpresa, accessToken);
  }
  getNextNumeroSecuencialCompraByIdEmp(idEmp: any, tipoDoc: any, idProveedor: any, compraNumero: any, accessToken: any){
    return this.coreEndPoint.getNextNumeroSecuencialCompraByIdEmp(idEmp,tipoDoc,idProveedor,compraNumero,accessToken);
  }
  deleteCompraByIdEmp(idEmpresa: any, idCompra: any, tipoDoc: any, accessToken: any){
    return this.coreEndPoint.deleteCompraToBD({idEmpresa,idCompra,tipoDoc},accessToken);
  }
  getDataByIdCompra(idVenta: any, idEmp: any, accessToken: any){
    return this.coreEndPoint.getDataByIdCompra(idVenta, idEmp,accessToken);
  }
  getExcelListaCompras(idEmpresa: any, nombreCi: any, noDoc: any, fechaIni: any, 
    fechaFin: any,accesToken: any){
    return this.coreEndPoint.getListaComprasExcelByIdEmp(idEmpresa,nombreCi,noDoc,fechaIni,fechaFin,accesToken);
  }
  getExcelListaResumenCompras(idEmpresa: any, nombreCi: any, noDoc: any, fechaIni: any, 
  fechaFin: any,accesToken: any){
    return this.coreEndPoint.getListaResumenComprasExcelByIdEmp(idEmpresa,nombreCi,noDoc,fechaIni,fechaFin,accesToken);
  }



  //CAJA
  getListMovimientosCajaByIdEmp(idEmpresa: any, nombreUsuario: any, tipo: any, concepto: any, fechaIni: any, 
    fechaFin: any, accessToken: any){
    return this.coreEndPoint.getListaMovimientosCajaByIdEmp(idEmpresa,nombreUsuario,tipo,concepto,fechaIni,fechaFin,accessToken);
  }
  getListMovimientosCuadrarCajaByIdEmp(idEmpresa: any, idUsuario: any,fechaIni: any, fechaFin: any, accessToken: any){
    return this.coreEndPoint.getListaMovimientosCuadrarCajaByIdEmp(idEmpresa,idUsuario,fechaIni,fechaFin,accessToken);
  }
  getValorCajaByIdEmp(idEmpresa: any, accessToken: any){
    return this.coreEndPoint.getValorCajaByIdEmp(idEmpresa,accessToken);
  }
  insertCuadreCajaByIdEmp(postData: any, accessToken: any){
    return this.coreEndPoint.insertCuadreCajaToBD(postData,accessToken);
  }
  insertIngresoEgresoByIdEmp(postData: any, accessToken: any){
    return this.coreEndPoint.insertIngresoEgresoToBD(postData, accessToken);
  }
  getListMovCajaExcelByIdEmp(idEmpresa: any, nombreUsuario: any, tipo: any, concepto: any, fechaIni: any, 
    fechaFin: any, accessToken: any){
    return this.coreEndPoint.getListaMoviCajaExcelByIdEmp(idEmpresa,nombreUsuario,tipo,concepto,fechaIni,fechaFin,accessToken);
  }


  //CONFIGURACIONES
  insertListConfigsToBD(postData: any, accessToken: any){
    return this.coreEndPoint.insertListConfigsToBD(postData, accessToken);
  }
  getListConfigsByIdEmp(idEmp: any, accessToken: any){
    return this.coreEndPoint.getListConfigsByIdEmp(idEmp, accessToken);
  }
  getConfigByNameIdEmp(idEmp: any, nombreConfig: any, accessToken: any){
    return this.coreEndPoint.getConfigByIdEmp(idEmp, nombreConfig, accessToken); 
  }


  //DASHBOARD
  getValueVentaDiaria(idEmp: any, fechaIni: any, fechaFin: any,accessToken: any){
    return this.coreEndPoint.getValorVentaDiariaByIdEmp(idEmp,fechaIni,fechaFin, accessToken);
  }
  getValueVentaMensuual(idEmp: any, fechaIni: any, fechaFin: any,accessToken: any){
    return this.coreEndPoint.getValorVentaMensualByIdEmp(idEmp,fechaIni,fechaFin, accessToken);
  }
  getInfoClientesRegistrados(idEmp: any,accessToken: any){
    return this.coreEndPoint.getInfoClientesRegistradosIdEmp(idEmp,accessToken);
  }
  getInfoProductosRegistrados(idEmp: any,accessToken: any){
    return this.coreEndPoint.getInfoProductosRegistradosIdEmp(idEmp,accessToken);
  }
  getNumDocAndLicenceDays(rucEmp: any,accessToken: any){
    return this.coreEndPoint.getNumeroDocsAndLicenceDays(rucEmp,accessToken);
  }
  getProductosDelMes(idEmp: any,fechaIni: any,fechaFin: any,accessToken: any){
    return this.coreEndPoint.getProductosDelMesIdEmp(idEmp,fechaIni,fechaFin,accessToken);
  }
  getClientesDelMes(idEmp: any,fechaIni: any,fechaFin: any,accessToken: any){
    return this.coreEndPoint.getClientesDelMesIdEmp(idEmp,fechaIni,fechaFin,accessToken);
  }
  getVentasDelDiaFormaPago(idEmp: any,fechaIni: any,fechaFin: any,accessToken: any){
    return this.coreEndPoint.getVentaDelDiaFormaPago(idEmp,fechaIni,fechaFin,accessToken);
  }

  //DOCUMENTOS ELECTRONICOS
  getListDocumentosElectronicosByIdEmp(idEmp: any, fechaIni:any,fechaFin:any,
    tipo:any,nombresci:any,nodoc: any,accessToken:any){

    return this.coreEndPoint.getDocumentosElectronicosByIdEmp(idEmp,fechaIni,fechaFin,tipo,nombresci,nodoc,accessToken);
  }

  getPdfFromVentaByIdEmp(idEmp: any, identificacion: any, idVentaCompra: any, accesToken: any){
    return this.coreEndPoint.getPDFVentaByIdEmp(idEmp,identificacion,idVentaCompra, accesToken);
  }
}
