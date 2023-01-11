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

  validateDefaultUser(ruc: string){
    return this.coreEndPoint.validateUserDefaultByRuc(ruc);
  }

  //ESTABLECIMIENTOS
  insertDatosEstablecimiento(postData: any, accesToken: any){
    return this.coreEndPoint.insertDatosEstablecimiento(postData, accesToken);
  }
  actualizarDatosEstablecimiento(postData: any, accesToken: any){
    return this.coreEndPoint.actualizarDatosEstablecimiento(postData, accesToken);
  }
  getEstablecimientosByIdEmp(idEmp: any, nombreBd: string, accesToken: any){
    return this.coreEndPoint.getListEstablecimientosByIdEmp(idEmp, nombreBd,accesToken);
  }
  deleteEstablecimientoById(idEmp: any, idEstablecimiento: any, nombreBd: string, accessToken: any){
    return this.coreEndPoint.deleteEstablecimientoByIdEmpToBD(idEmp, idEstablecimiento, nombreBd, accessToken);
  }

  getEstablecimientoByIdEmp(idEmp: any, idEstableci: any,nombreBd: string, accesToken: any){
    return this.coreEndPoint.getListEstablecimientoByIdEmp(idEmp, idEstableci,nombreBd,accesToken);
  }
  getEstablecimientoByIdEmpNumeroEst(idEmp: any, numeroEstable: any,nombreBd: string, accesToken: any){
    return this.coreEndPoint.getEstablecimientosByIdEmpNumeroEst(idEmp, numeroEstable,nombreBd,accesToken);
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
  recuperarCuenta(ruc: any,email: any){
    return this.coreEndPoint.recuperarCuenta(ruc, email);
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
  importListClientes(postData: any, accessToken: any){
    return this.coreEndPoint.importListClientes(postData, accessToken, );
  }
  updateClienteToBD(postData: any, accessToken: any){
    return this.coreEndPoint.updateClienteToBD(postData, accessToken);
  }
  deleteClienteByIdEmp(idCliente: any, idEmp: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.deleteClienteByIdEmpToBD(idCliente, idEmp, accessToken, nombreBd);
  }

  getListClientesByIdEmp(idEmpresa: any, accessToken: any,nombreBd: string){
      return this.coreEndPoint.getListClientesByIdEmp(idEmpresa, accessToken, nombreBd);
  }
  getClienteByIdClienteIdEmp(idCliente: any, idEmpresa: any, accessToken: any, nombreBd: string){
      return this.coreEndPoint.getClienteByIdEmp(idCliente, idEmpresa, accessToken, nombreBd);
  }
  searchClientesByIdEmpText(idEmpresa: any, textSearch: any, accessToken: any, nombreBd: string){
      return this.coreEndPoint.searchClientesByIdEmpText(idEmpresa, textSearch, accessToken, nombreBd);
  }
  getExcelListClientes(idEmpresa: any, accesToken: any, nombreBd: string){
    return this.coreEndPoint.getClientesExcelById(idEmpresa,accesToken, nombreBd);
  }
  getTemplateClientesExcel(idEmpresa: any, accesToken: any, nombreBd: string){
    return this.coreEndPoint.getTemplateClientesExcelIdEmp(idEmpresa,accesToken, nombreBd);
  }

  //PROFORMAS
  getListProformasByIdEmp(idEmpresa: any,nombreci: any, noDoc: any, fechaIni: any, fechaFin: any, accessToken: any,nombreBd: string){
    return this.coreEndPoint.getListProformasByIdEmp(idEmpresa, nombreci, noDoc, fechaIni, fechaFin, accessToken, nombreBd);
  }
  getNextNumeroProformaByUsuario(idEmp: any, idUsuario: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.getNextNoProformaByUsr(idEmp,idUsuario,accessToken, nombreBd);
  }
  insertProformaToBD(postData: any, accessToken: any){
    return this.coreEndPoint.insertProformaToBD(postData, accessToken);
  }
  deleteProformaByIdEmp(idEmpresa: any, idProforma: any,accessToken: any, nombreBd: string){
    return this.coreEndPoint.deleteProformaToBD({idEmpresa,idProforma, nombreBd},accessToken);
  }
  getExcelListaProformas(idEmpresa: any, nombreCi: any, noDoc: any, fechaIni: any, 
                        fechaFin: any,accesToken: any, nombreBd: string){
    return this.coreEndPoint.getListaProformasExcelByIdEmp(idEmpresa,nombreCi,noDoc,fechaIni,fechaFin,accesToken, nombreBd);
  }
  getPdfFromProformaByIdEmp(idEmp: any, identificacion: any, idProforma: any, accesToken: any, nombreBd: string){
    return this.coreEndPoint.getPDFProformaByIdEmp(idEmp,identificacion,idProforma, accesToken, nombreBd);
  }
  getDataByIdProforma(idProforma: any, idEmp: any,rucEmpresa: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.getDataByIdProforma(idProforma, idEmp,rucEmpresa, accessToken, nombreBd);
  }

  //USUARIOS
  getUsuariosByIdEmp(idEmp: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.getUsuariosByIdEmp(idEmp, accessToken, nombreBd);
  }
  insertUsuarioToBD(postData: any, accessToken: any){
    return this.coreEndPoint.insertUsuarioToBD(postData, accessToken);
  }
  getUsuarioById(idUsuario: any, idEmpresa: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.getUsuarioById(idUsuario, idEmpresa, accessToken, nombreBd);
  }
  updateUsuarioToBD(postData: any, accessToken: any){
    return this.coreEndPoint.updateUsuarioToBD(postData, accessToken);
  }
  deleteUsuarioByIdEmp(idUser: any, idEmp: any, accessToken: any,nombreBd: string){
    return this.coreEndPoint.deleteUsuarioByIdEmpToBD(idUser, idEmp, accessToken,nombreBd);
  }
  searchUsuariosByIdEmpText(idEmpresa: any, textSearch: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.searchUsuariosByIdEmpText(idEmpresa, textSearch, accessToken, nombreBd);
  }
  getExcelListUsuarios(idEmpresa: any, accesToken: any,nombreBd: string){
    return this.coreEndPoint.getUsuariosExcelById(idEmpresa,accesToken,nombreBd);
  }

  // PROVEEDORES
  getListProveedoresByIdEmp(idEmpresa: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.getListProveedoresByIdEmp(idEmpresa, accessToken, nombreBd);
  }
  getProveedorByIdProvIdEmp(idProv: any, idEmpresa: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.getProveedorByIdEmp(idProv, idEmpresa, accessToken, nombreBd);
  }
  insertProveedorToBD(postData: any, accessToken: any){
    return this.coreEndPoint.insertProveedorToBD(postData, accessToken);
  }
  updateProveedorToBD(postData: any, accessToken: any){
    return this.coreEndPoint.updateProveedorToBD(postData, accessToken);
  }
  deleteProveedorByIdEmp(idCliente: any, idEmp: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.deleteProveedorByIdEmpToBD(idCliente, idEmp, accessToken, nombreBd);
  }
  searchProveedoresByIdEmpText(idEmpresa: any, textSearch: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.searchProveedoresByIdEmpText(idEmpresa, textSearch, accessToken, nombreBd);
  }
  getExcelListProveedores(idEmpresa: any, accesToken: any, nombreBd: string){
    return this.coreEndPoint.getProveedoresExcelById(idEmpresa,accesToken, nombreBd);
  }

  // PRODUCTOS
  getListProductosByIdEmp(idEmpresa: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.getListProductosByIdEmp(idEmpresa, accessToken, nombreBd);
  }
  getListProductosByIdEmpActivo(idEmpresa: any,nombreBd: any, accessToken: any){
    return this.coreEndPoint.getListProductosByIdEmpActivo(idEmpresa, nombreBd, accessToken);
  }
  getProductoByIdEmp(idProducto: any, idEmpresa: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.getProductoByIdEmp(idProducto, idEmpresa, accessToken, nombreBd);
  }
  insertProductoToBD(postData: any, accessToken: any){
    return this.coreEndPoint.insertProductoToBD(postData, accessToken);
  }
  updateProductoToBD(postData: any, accessToken: any){
    return this.coreEndPoint.updateProductoToBD(postData, accessToken);
  }
  deleteProductoByIdEmp(idCliente: any, idEmp: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.deleteProductoByIdEmpToBD(idCliente, idEmp, accessToken, nombreBd);
  }

  getCategoriasProductosByIdEmp(idEmpresa: any, accessToken: any,  nombreBd: string){
    return this.coreEndPoint.getCategoriasByIdEmp(idEmpresa, accessToken, nombreBd);
  }
  getMarcasProductosByIdEmp(idEmpresa: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.getMarcasByIdEmp(idEmpresa, accessToken, nombreBd);
  }
  searchProductosByIdEmpText(idEmpresa: any, textSearch: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.searchProductosByIdEmpText(idEmpresa, textSearch, accessToken, nombreBd);
  }
  searchProductosByIdEmpTextActivo(idEmpresa: any, textSearch: any,nombreBd: string, accessToken: any){
    return this.coreEndPoint.searchProductosByIdEmpTextActivo(idEmpresa, textSearch,nombreBd, accessToken);
  }
  getExcelListProductos(idEmpresa: any, accesToken: any, nombreBd: string){
    return this.coreEndPoint.getProductosExcelById(idEmpresa,accesToken, nombreBd);
  }

  //VENTAS FACTURA, TICKET, OTROS
  insertVentaFacturaToBD(postData: any, accessToken: any){
    return this.coreEndPoint.insertVentaToBD(postData, accessToken);
  }
  getListaVentasByIdEmp(idEmpresa: any, nombreCi: any, noDoc: any, fechaIni: any, 
    fechaFin: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.getListaVentasByIdEmp(idEmpresa,nombreCi,noDoc,fechaIni,fechaFin,accessToken, nombreBd);
  }
  getResumenVentasByIdEmp(idEmpresa: any, nombreCi: any, noDoc: any, fechaIni: any, 
                        fechaFin: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.getListaResumenVentasByIdEmp(idEmpresa,nombreCi,noDoc,fechaIni,fechaFin,accessToken, nombreBd);
  }
  getConsumidorFinalOrCreate(idEmpresa: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.getConsumidorFinalByIdEmp(idEmpresa, accessToken, nombreBd);
  }
  updateEstadoVentaByIdEmp(idEmpresa: any, idVenta: any, estado: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.updateEstadoVentaToBD({idEmpresa,idVenta,estado,nombreBd},accessToken);
  }
  deleteVentaByIdEmp(idEmpresa: any, idVenta: any, estado: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.deleteVentaToBD({idEmpresa,idVenta,estado, nombreBd},accessToken);
  }
  getNextNumeroSecuencialByIdEmp(idEmp: any, tipoDoc: any, fac001: any, fac002: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.getNextNumeroSecuencialByIdEmp(idEmp,tipoDoc,fac001,fac002,accessToken, nombreBd);
  }
  getNextNumeroPuntoVentaByUsuario(idEmp: any, tipoDoc: any, idUsuario: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.getNextNoPuntoVentaByUsr(idEmp,tipoDoc,idUsuario,accessToken, nombreBd);
  }
  getDataByIdVenta(idVenta: any, idEmp: any,rucEmpresa: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.getDataByIdVenta(idVenta, idEmp,rucEmpresa, accessToken, nombreBd);
  }
  getExcelListaVentas(idEmpresa: any, nombreCi: any, noDoc: any, fechaIni: any, 
                      fechaFin: any,accesToken: any, nombreBd: string){
    return this.coreEndPoint.getListaVentasExcelByIdEmp(idEmpresa,nombreCi,noDoc,fechaIni,fechaFin,accesToken, nombreBd);
  }
  getExcelListaResumenVentas(idEmpresa: any, nombreCi: any, noDoc: any, fechaIni: any, 
    fechaFin: any,accesToken: any, nombreBd: string){
    return this.coreEndPoint.getListaResumenVentasExcelByIdEmp(idEmpresa,nombreCi,noDoc,fechaIni,fechaFin,accesToken, nombreBd);
}

  //COMPRAS
  insertCompraFacturaToBD(postData: any, accessToken: any){
    return this.coreEndPoint.insertCompraToBD(postData, accessToken);
  }
  getListaComprasByIdEmp(idEmpresa: any, nombreCi: any, noDoc: any, fechaIni: any, 
    fechaFin: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.getListaComprasByIdEmp(idEmpresa,nombreCi,noDoc,fechaIni,fechaFin,accessToken, nombreBd);
  }
  getResumenComprasByIdEmp(idEmpresa: any, nombreCi: any, noDoc: any, fechaIni: any, 
    fechaFin: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.getListaResumenComprasByIdEmp(idEmpresa,nombreCi,noDoc,fechaIni,fechaFin,accessToken, nombreBd);
  }
  getProveedorGenericoOrCreate(idEmpresa: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.getProveedorGenericoByIdEmp(idEmpresa, accessToken, nombreBd);
  }
  getNextNumeroSecuencialCompraByIdEmp(idEmp: any, tipoDoc: any, idProveedor: any, compraNumero: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.getNextNumeroSecuencialCompraByIdEmp(idEmp,tipoDoc,idProveedor,compraNumero,accessToken, nombreBd);
  }
  deleteCompraByIdEmp(idEmpresa: any, idCompra: any, tipoDoc: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.deleteCompraToBD({idEmpresa,idCompra,tipoDoc, nombreBd},accessToken);
  }
  getDataByIdCompra(idVenta: any, idEmp: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.getDataByIdCompra(idVenta, idEmp,accessToken, nombreBd);
  }
  getExcelListaCompras(idEmpresa: any, nombreCi: any, noDoc: any, fechaIni: any, 
    fechaFin: any,accesToken: any, nombreBd: string){
    return this.coreEndPoint.getListaComprasExcelByIdEmp(idEmpresa,nombreCi,noDoc,fechaIni,fechaFin,accesToken, nombreBd);
  }
  getExcelListaResumenCompras(idEmpresa: any, nombreCi: any, noDoc: any, fechaIni: any, 
  fechaFin: any,accesToken: any, nombreBd: string){
    return this.coreEndPoint.getListaResumenComprasExcelByIdEmp(idEmpresa,nombreCi,noDoc,fechaIni,fechaFin,accesToken, nombreBd);
  }
  verifyProductsXml(postData: any, accesToken: any){
      return this.coreEndPoint.verifyProductsXml(postData, accesToken);
  }
  getXmlSriByNumAutorizacion(numeroAutorizacion: any, accesToken: any){
    return this.coreEndPoint.getxmlCompraSriNumAutorizacion(numeroAutorizacion, accesToken);
  }
  generatePdfXmlCompra(datosFactura: any, accessToken: any){
    return this.coreEndPoint.generatePdfByXmlCompra(datosFactura, accessToken);
  }


  //CAJA
  getListMovimientosCajaByIdEmp(idEmpresa: any, nombreUsuario: any, tipo: any, concepto: any, fechaIni: any, 
    fechaFin: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.getListaMovimientosCajaByIdEmp(idEmpresa,nombreUsuario,tipo,concepto,fechaIni,fechaFin,accessToken, nombreBd);
  }
  getListMovimientosCuadrarCajaByIdEmp(idEmpresa: any, idUsuario: any,fechaIni: any, fechaFin: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.getListaMovimientosCuadrarCajaByIdEmp(idEmpresa,idUsuario,fechaIni,fechaFin,accessToken, nombreBd);
  }
  getValorCajaByIdEmp(idEmpresa: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.getValorCajaByIdEmp(idEmpresa,accessToken,nombreBd);
  }
  insertCuadreCajaByIdEmp(postData: any, accessToken: any){
    return this.coreEndPoint.insertCuadreCajaToBD(postData,accessToken);
  }
  insertIngresoEgresoByIdEmp(postData: any, accessToken: any){
    return this.coreEndPoint.insertIngresoEgresoToBD(postData, accessToken);
  }
  getListMovCajaExcelByIdEmp(idEmpresa: any, nombreUsuario: any, tipo: any, concepto: any, fechaIni: any, 
    fechaFin: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.getListaMoviCajaExcelByIdEmp(idEmpresa,nombreUsuario,tipo,concepto,fechaIni,fechaFin,accessToken, nombreBd);
  }


  //CONFIGURACIONES
  insertListConfigsToBD(postData: any, accessToken: any){
    return this.coreEndPoint.insertListConfigsToBD(postData, accessToken);
  }
  insertListConfigsFacElecToBD(postData: any, accessToken: any){
    return this.coreEndPoint.insertListConfigsFacElec(postData, accessToken);
  }
  getListConfigsByIdEmp(idEmp: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.getListConfigsByIdEmp(idEmp, accessToken, nombreBd);
  }
  getListConfigsFirmaElectronicaByIdEmp(ruc: any, accessToken: any){
    return this.coreEndPoint.getListConfigsFirmaElectronicaByIdEmp(ruc, accessToken);
  }
  getConfigByNameIdEmp(idEmp: any, nombreConfig: any, accessToken: any, nombreBd: string){
    return this.coreEndPoint.getConfigByIdEmp(idEmp, nombreConfig, accessToken, nombreBd); 
  }
  insertFirmaElectronicaConfig(postData: any, file: any, accessToken: any){
    return this.coreEndPoint.insertFirmaElectronicaConfig(postData, file, accessToken);
  }

  //DASHBOARD
  getValueVentaDiaria(idEmp: any, fechaIni: any, fechaFin: any,accessToken: any, nombreBd: string){
    return this.coreEndPoint.getValorVentaDiariaByIdEmp(idEmp,fechaIni,fechaFin, accessToken, nombreBd);
  }
  getValueVentaMensuual(idEmp: any, fechaIni: any, fechaFin: any,accessToken: any, nombreBd: string){
    return this.coreEndPoint.getValorVentaMensualByIdEmp(idEmp,fechaIni,fechaFin, accessToken, nombreBd);
  }
  getInfoClientesRegistrados(idEmp: any,accessToken: any, nombreBd: string){
    return this.coreEndPoint.getInfoClientesRegistradosIdEmp(idEmp,accessToken, nombreBd);
  }
  getInfoProductosRegistrados(idEmp: any,accessToken: any, nombreBd: string){
    return this.coreEndPoint.getInfoProductosRegistradosIdEmp(idEmp,accessToken, nombreBd);
  }
  getNumDocAndLicenceDays(rucEmp: any,accessToken: any,nombreBd: string){
    return this.coreEndPoint.getNumeroDocsAndLicenceDays(rucEmp,accessToken, nombreBd);
  }
  getProductosDelMes(idEmp: any,fechaIni: any,fechaFin: any,accessToken: any, nombreBd: string){
    return this.coreEndPoint.getProductosDelMesIdEmp(idEmp,fechaIni,fechaFin,accessToken, nombreBd);
  }
  getClientesDelMes(idEmp: any,fechaIni: any,fechaFin: any,accessToken: any, nombreBd: string){
    return this.coreEndPoint.getClientesDelMesIdEmp(idEmp,fechaIni,fechaFin,accessToken, nombreBd);
  }
  getVentasDelDiaFormaPago(idEmp: any,fechaIni: any,fechaFin: any,accessToken: any, nombreBd: string){
    return this.coreEndPoint.getVentaDelDiaFormaPago(idEmp,fechaIni,fechaFin,accessToken,nombreBd);
  }

  //DOCUMENTOS ELECTRONICOS
  getListDocumentosElectronicosByIdEmp(idEmp: any, fechaIni:any,fechaFin:any,
    tipo:any,nombresci:any,nodoc: any,accessToken:any, nombreBd: string){

    return this.coreEndPoint.getDocumentosElectronicosByIdEmp(idEmp,fechaIni,fechaFin,tipo,nombresci,nodoc,accessToken, nombreBd);
  }
  getListDocumentosElectronicosByIdEmpNoAutorizados(idEmp: any,accessToken:any, nombreBd: string){
    return this.coreEndPoint.getDocumentosElectronicosByIdEmpNoAutorizados(idEmp,accessToken, nombreBd);
  }


  getPdfFromVentaByIdEmp(idEmp: any, identificacion: any, idVentaCompra: any, accesToken: any, nombreBd: string){
    return this.coreEndPoint.getPDFVentaByIdEmp(idEmp,identificacion,idVentaCompra, accesToken, nombreBd);
  }
  autorizarDocumentoElectronico(idEmp: any, idVentaCompra: number, identificacion: string, tipo: string, 
    accesToken: any, estado: string){
    return this.coreEndPoint.autorizarDocumentosElectronicosByIdEmp(idEmp,idVentaCompra,identificacion,tipo,accesToken, estado);
  }
  autorizarListDocumentoElectronico(postData: any, accesToken: any){
    return this.coreEndPoint.autorizarListDocumentoElectronicaByIdEmp(postData,accesToken);
  }

  getExcelListDocElectronic(idEmp: any,rucEmpresa:any, fechaIni:any,fechaFin:any,
                        tipo:any,nombresci:any,nodoc: any, accesToken: any, nombreBd: string){
    return this.coreEndPoint.getDocElectronicosExcelIdEmp(idEmp,rucEmpresa, fechaIni,fechaFin,tipo,nombresci,nodoc,accesToken, nombreBd);
  }
}
