import { HttpClient, HttpHeaders, HttpParams, HttpParamsOptions } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class EndPointProvider {


    constructor(private http: HttpClient,
      private router: Router){}

    private readonly apiVersion = '1.0.0';
    private readonly appVersion = '1.0.0';
    //private readonly apiUrl = 'http://192.168.1.10:8086/api/'; 

    //private readonly apiUrl = 'http://localhost:3000/api/';
    private readonly apiUrl = 'https://www.sheylaweb.net/api/';


    private readonly searchDatosClienteSri = 'https://sheyla.net/SRI/SRI.php';
    //private readonly searchDatosClienteSri = 'http://sheyla2.dyndns.info/SRI/SRI.php';
    //private readonly searchDatosClienteSriLocal = 'http://localhost:4200/SRI';

    //SEARCH CLIENT BY CI OR RUC
    searchClientByCiRuc(ciRuc: any): Observable<string>{

      const header = this.getRequestHeaderSearchCliente();

      let paramsRequest = new HttpParams().set('ruc', ciRuc).set('actualizado', 'Y');
      const httpOptions = {
        headers: header,
        params: ciRuc ? paramsRequest : {}
      }
      
      return this.http.get(this.searchDatosClienteSri, {params: paramsRequest, responseType: 'text'});
    }

    //CLIENTES
    private readonly _listClientes: String = 'clientes';
    private get listClientesUrl(){
      return this.apiUrl + this._listClientes;
    }

    getListClienets<T>(accesToken: any): Observable<T>{
      const endpointUrl = this.listClientesUrl;
      const header = this.getRequestHeader(accesToken)

      return this.http.get<T>(endpointUrl, header);
    }
    private readonly _getClientesExcelIdEmp: string = "clientes/getlistclientesexcel";
    private get getClientesExcelByIdEmpUrl(){
      return this.apiUrl + this._getClientesExcelIdEmp;
    }
    getClientesExcelById(idEmp: any, accessToken: any): Observable<Blob>{
        const endPointUrl = this.getClientesExcelByIdEmpUrl;

        const header = this.getRequestHeaderFiles(accessToken)
        const params1 = new HttpParams().set('idEmp', idEmp);

        return this.http.get(endPointUrl, {responseType: 'blob', params: params1, headers: header});
    }

    //LOGUIN
    //private readonly _loginVerify: string = 'loginverify'
    private readonly _loginVerify: string = 'loginverify2'
    private get loginVerifyUrl(){
      return this.apiUrl + this._loginVerify;
    }
    loginVerify<T>(postData: any): Observable<T>{
      const endPointUrl = this.loginVerifyUrl;
      return this.http.post<T>(endPointUrl, postData);
    }


    private readonly _validateUserDefaultByRuc: string = "verifyExistAdminByRucEmp"
    private get validateUserDefaultByRucURL(){
      return this.apiUrl + this._validateUserDefaultByRuc;
    }
    validateUserDefaultByRuc<T>(ruc: any): Observable<T>{
       const endPointUrl = this.validateUserDefaultByRucURL;

       let paramsRequest = new HttpParams().set('ruc', ruc);

       const httpOptions = {
         params: paramsRequest
       }

     return this.http.get<T>(endPointUrl, httpOptions);
    }


    private readonly _crearNuevaEmpresaByRuc: string = "crearnuevaempresa"
    private get crearNuevaEmpresaByRucURL(){
      return this.apiUrl + this._crearNuevaEmpresaByRuc;
    }
    crearNuevaEmpresaByRuc<T>(ruc: any): Observable<any>{
       const endPointUrl = this.crearNuevaEmpresaByRucURL;

       let paramsRequest = new HttpParams().set('ruc', ruc);

       const httpOptions = {
         params: paramsRequest
       }

     return this.http.get<T>(endPointUrl, httpOptions);
    }

    private readonly _recuperarCuenta: string = "recoverypassword"
    private get _recuperarCuentaURL(){
      return this.apiUrl + this._recuperarCuenta;
    }
    recuperarCuenta<T>(ruc: any, email: any): Observable<any>{
       const endPointUrl = this._recuperarCuentaURL;

       let paramsRequest = new HttpParams().set('ruc', ruc).set('email',email);

       const httpOptions = {
         params: paramsRequest
       }

     return this.http.get<T>(endPointUrl, httpOptions);
    }


    //GET EMPRESA DATA BY RUC AND ID
    private readonly _empresaDataByRucAndID: string = "getEmpresaByRuc"

    private get empresaByRucAndIdUrl(){
      return this.apiUrl + this._empresaDataByRucAndID;
    }
    empresaByRucAndId<T>(postData: any, accesToken: any): Observable<any>{
      const endPointUrl = this.empresaByRucAndIdUrl;

      return this.http.post<any>(endPointUrl, postData, this.getRequestHeader(accesToken));
    }
    //UPDATE DATOS EMPRESA
    private readonly _updateDatosEmpresa: string = "updateempresa";
    private get updateDatosEmpresaUrl(){
      return this.apiUrl + this._updateDatosEmpresa;
    }
    updateDatosEmpresa<T>(postData: any, accesToken: any): Observable<T>{
      const endPointUrl = this.updateDatosEmpresaUrl;

      return this.http.post<any>(endPointUrl, postData, this.getRequestHeader(accesToken));
    }

    private readonly _getLogoEmpresaByRuc: string = "/getimagenlogobyrucempresa";
    private get getLogoEmpresaByRucURL(){
      return this.apiUrl + this._getLogoEmpresaByRuc;
    }
    getLogoEmpresaByRuc(rucEmp: any, accessToken: any): Observable<Blob>{
        const endPointUrl = this.getLogoEmpresaByRucURL;

        const header = this.getRequestHeaderFiles(accessToken)
        const params1 = new HttpParams().set('ruc', rucEmp);

        return this.http.get(endPointUrl, {responseType: 'blob', params: params1, headers: header});
    } 
    

    // METHODS FOR CLIENTES
    private readonly _insertCliente: string = "clientes/insertar";
    private get insertClienteUrl(){
      return this.apiUrl + this._insertCliente;
    }
    insertClienteToBD<T>(postData: any, accessToken: any): Observable<T>{
        const endPointUrl = this.insertClienteUrl;
        
        return this.http.post<T>(endPointUrl, postData, this.getRequestHeader(accessToken));
    }

    private readonly _updateCliente: string = "clientes/update";
    private get updateClienteUrl(){
      return this.apiUrl + this._updateCliente;
    }
    updateClienteToBD<T>(postData: any, accessToken: any): Observable<T>{
        const endPointUrl = this.updateClienteUrl;        
        return this.http.post<T>(endPointUrl, postData, this.getRequestHeader(accessToken));
    }


    private readonly _deleteClienteByIdEmp: string = "clientes/delete";
    private get deleteClienteByIdEmp(){
      return this.apiUrl + this._deleteClienteByIdEmp;
    }
    deleteClienteByIdEmpToBD<T>(idCliente: any, idEmpresa: any, accessToken: any): Observable<T>{
      const endPointUrl = this.deleteClienteByIdEmp;
      const postData = {
        'idEmpresa': idEmpresa,
        'idCliente': idCliente
      }

      return this.http.post<T>(endPointUrl,postData,  this.getRequestHeader(accessToken));
    }


    private readonly _listClientesByIdEmp: string = 'clientes/getClientesIdEmp';

    private get listClientesByIdEmp(){
      return this.apiUrl + this._listClientesByIdEmp;
    }
    getListClientesByIdEmp<T>(idEmpresa: any, accessToken: any): Observable<T>{
      const endpointUrl = this.listClientesByIdEmp;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmpresa);

      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }

    private readonly _clienteByIdEmp: string = 'clientes/getClienteIdEmp';
    private get clienteByIdEmp(){
      return this.apiUrl + this._clienteByIdEmp;
    }
    getClienteByIdEmp<T>(idCliente: any, idEmpresa: any, accessToken: any): Observable<T>{
        const endpointUrl = this.clienteByIdEmp;

        const header = this.getRequestHeaderClientes(accessToken);
        let paramsRequest = new HttpParams().set('idCliente', idCliente).set('idEmp', idEmpresa);
        const httpOptions = {
          headers: header,
          params: paramsRequest
        }

        return this.http.get<T>(endpointUrl, httpOptions);
    }
    private readonly _searchClientesByIdEmp: string = 'clientes/searchClienteByIdEmp';
    private get searchClientesByIdEmp(){
      return this.apiUrl + this._searchClientesByIdEmp;
    }
    searchClientesByIdEmpText<T>(idEmpresa: any, textSearch: any, accessToken: any): Observable<T>{
        const endpointUrl = this.searchClientesByIdEmp;

        const header = this.getRequestHeaderClientes(accessToken);
        let paramsRequest = new HttpParams().set('textSearch', textSearch).set('idEmp', idEmpresa);
        const httpOptions = {
          headers: header,
          params: paramsRequest
        }

        return this.http.get<T>(endpointUrl, httpOptions);
    }

    //METHODS FOR USUARIOS 
    private readonly _usuariosByIdEmp: string = 'usuarios/getUsuariosByIdEmp';
    private get usuariosByIdEmp(){
      return this.apiUrl + this._usuariosByIdEmp;
    }
    getUsuariosByIdEmp<T>(idEmp: any, accesToken: any){
      const endpointUrl = this.usuariosByIdEmp;
      const header = this.getRequestHeaderClientes(accesToken);

      const httpOptions = {
        headers: header, 
        params: new HttpParams().set('idEmp', idEmp)
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }

    private readonly _insertUsuario: string = "usuarios/insertar";
    private get insertUsuarioUrl(){
      return this.apiUrl + this._insertUsuario;
    }
    insertUsuarioToBD<T>(postData: any, accessToken: any): Observable<T>{
        const endPointUrl = this.insertUsuarioUrl;   
        return this.http.post<T>(endPointUrl, postData, this.getRequestHeader(accessToken));
    }

    private readonly _getUsuarioById: string = "usuarios/getUsuarioByIdEmp";
    private get getUsuarioByIdUrl(){
      return this.apiUrl + this._getUsuarioById;
    }
    getUsuarioById<T>(idUser: any, idEmp: any, accessToken: any): Observable<T>{
        const endPointUrl = this.getUsuarioByIdUrl;

        const header = this.getRequestHeaderClientes(accessToken)
        const httpOptions = {
          headers: header, 
          params: new HttpParams().set('id', idUser).set('idEmp', idEmp)
        }

        return this.http.get<T>(endPointUrl, httpOptions);
    }
    private readonly _updateUsuario: string = "usuarios/update";
    private get updateUsuarioUrl(){
      return this.apiUrl + this._updateUsuario;
    }
    updateUsuarioToBD<T>(postData: any, accessToken: any): Observable<T>{
        const endPointUrl = this.updateUsuarioUrl;        
        return this.http.post<T>(endPointUrl, postData, this.getRequestHeader(accessToken));
    }
    private readonly _deleteUsuarioByIdEmp: string = "usuarios/delete";
    private get deleteUsuarioByIdEmp(){
      return this.apiUrl + this._deleteUsuarioByIdEmp;
    }
    deleteUsuarioByIdEmpToBD<T>(idUser: any, idEmpresa: any, accessToken: any): Observable<T>{
      const endPointUrl = this.deleteUsuarioByIdEmp;
      const postData = {
        'idEmpresa': idEmpresa,
        'idUser': idUser
      }

      return this.http.post<T>(endPointUrl,postData,  this.getRequestHeader(accessToken));
    }
    private readonly _searchUsuariosByIdEmp: string = 'usuarios/searchUsuariosByIdEmp';
    private get searchUsuariosByIdEmp(){
      return this.apiUrl + this._searchUsuariosByIdEmp;
    }
    searchUsuariosByIdEmpText<T>(idEmpresa: any, textSearch: any, accessToken: any): Observable<T>{
        const endpointUrl = this.searchUsuariosByIdEmp;

        const header = this.getRequestHeaderClientes(accessToken);
        let paramsRequest = new HttpParams().set('textSearch', textSearch).set('idEmp', idEmpresa);
        const httpOptions = {
          headers: header,
          params: paramsRequest
        }

        return this.http.get<T>(endpointUrl, httpOptions);
    }
    private readonly _getUsuariosExcelIdEmp: string = "usuarios/getlistusersexcel";
    private get getUsuariosExcelByIdEmpUrl(){
      return this.apiUrl + this._getUsuariosExcelIdEmp;
    }
    getUsuariosExcelById(idEmp: any, accessToken: any): Observable<Blob>{
        const endPointUrl = this.getUsuariosExcelByIdEmpUrl;

        const header = this.getRequestHeaderFiles(accessToken)
        const params1 = new HttpParams().set('idEmp', idEmp);

        return this.http.get(endPointUrl, {responseType: 'blob', params: params1, headers: header});
    }



    // METHODS FOR PROVEEDORES
    private readonly _listProveedoresByIdEmp: string = 'proveedores/getProveedoresByIdEmp';
    private get listProveedoresByIdEmp(){
      return this.apiUrl + this._listProveedoresByIdEmp;
    }
    getListProveedoresByIdEmp<T>(idEmpresa: any, accessToken: any): Observable<T>{
      const endpointUrl = this.listProveedoresByIdEmp;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmpresa);

      const httpOptions = {
        headers: header,
        params: paramsRequest
      }
      return this.http.get<T>(endpointUrl, httpOptions);
    }

    private readonly _proveedorByIdEmp: string = 'proveedores/getProveedorByIdEmp';
    private get proveedorByIdEmp(){
      return this.apiUrl + this._proveedorByIdEmp;
    }
    getProveedorByIdEmp<T>(idProveedor: any, idEmpresa: any, accessToken: any): Observable<T>{
        const endpointUrl = this.proveedorByIdEmp;

        const header = this.getRequestHeaderClientes(accessToken);
        let paramsRequest = new HttpParams().set('id', idProveedor).set('idEmp', idEmpresa);
        const httpOptions = {
          headers: header,
          params: paramsRequest
        }

        return this.http.get<T>(endpointUrl, httpOptions);
    }

    private readonly _insertProveedor: string = "proveedores/insertar";
    private get insertProveedorUrl(){
      return this.apiUrl + this._insertProveedor;
    }
    insertProveedorToBD<T>(postData: any, accessToken: any): Observable<T>{
        const endPointUrl = this.insertProveedorUrl;   
        return this.http.post<T>(endPointUrl, postData, this.getRequestHeader(accessToken));
    }
    private readonly _updateProveedor: string = "proveedores/update";
    private get updateProveedorUrl(){
      return this.apiUrl + this._updateProveedor;
    }
    updateProveedorToBD<T>(postData: any, accessToken: any): Observable<T>{
        const endPointUrl = this.updateProveedorUrl;        
        return this.http.post<T>(endPointUrl, postData, this.getRequestHeader(accessToken));
    }
    private readonly _deleteProveedorByIdEmp: string = "proveedores/delete";
    private get deleteProveedorByIdEmp(){
      return this.apiUrl + this._deleteProveedorByIdEmp;
    }
    deleteProveedorByIdEmpToBD<T>(idProv: any, idEmpresa: any, accessToken: any): Observable<T>{
      const endPointUrl = this.deleteProveedorByIdEmp;
      const postData = {
        'idEmpresa': idEmpresa,
        'idProv': idProv
      }

      return this.http.post<T>(endPointUrl,postData,  this.getRequestHeader(accessToken));
    }

    private readonly _searchProveedoresByIdEmp: string = 'proveedores/searchProveedorByIdEmp';
    private get searchProveedoresByIdEmp(){
      return this.apiUrl + this._searchProveedoresByIdEmp;
    }
    searchProveedoresByIdEmpText<T>(idEmpresa: any, textSearch: any, accessToken: any): Observable<T>{
        const endpointUrl = this.searchProveedoresByIdEmp;

        const header = this.getRequestHeaderClientes(accessToken);
        let paramsRequest = new HttpParams().set('textSearch', textSearch).set('idEmp', idEmpresa);
        const httpOptions = {
          headers: header,
          params: paramsRequest
        }

        return this.http.get<T>(endpointUrl, httpOptions);
    }

    private readonly _getProveedoresExcelIdEmp: string = "proveedores/getlistproveedoresexcel";
    private get getProveedoresExcelByIdEmpUrl(){
      return this.apiUrl + this._getProveedoresExcelIdEmp;
    }
    getProveedoresExcelById(idEmp: any, accessToken: any): Observable<Blob>{
        const endPointUrl = this.getProveedoresExcelByIdEmpUrl;

        const header = this.getRequestHeaderFiles(accessToken)
        const params1 = new HttpParams().set('idEmp', idEmp);

        return this.http.get(endPointUrl, {responseType: 'blob', params: params1, headers: header});
    }


     // METHODS FOR PRODUCTOS
     private readonly _listProductosByIdEmp: string = 'productos/getProductosByIdEmp';
     private get listProductosByIdEmp(){
       return this.apiUrl + this._listProductosByIdEmp;
     }
     getListProductosByIdEmp<T>(idEmpresa: any, accessToken: any): Observable<T>{
       const endpointUrl = this.listProductosByIdEmp;
       
       const header = this.getRequestHeaderClientes(accessToken);
 
       let paramsRequest = new HttpParams().set('idEmp', idEmpresa);
 
       const httpOptions = {
         headers: header,
         params: paramsRequest
       }
       return this.http.get<T>(endpointUrl, httpOptions);
     }
     // METHODS FOR PRODUCTOS
     private readonly _listProductosByIdEmpActivo: string = 'productos/getProductosNoAnuladoByIdEmp';
     private get listProductosByIdEmpActivo(){
       return this.apiUrl + this._listProductosByIdEmpActivo;
     }
     getListProductosByIdEmpActivo<T>(idEmpresa: any, accessToken: any): Observable<T>{
       const endpointUrl = this.listProductosByIdEmpActivo;
       
       const header = this.getRequestHeaderClientes(accessToken);
 
       let paramsRequest = new HttpParams().set('idEmp', idEmpresa);
 
       const httpOptions = {
         headers: header,
         params: paramsRequest
       }
       return this.http.get<T>(endpointUrl, httpOptions);
     }

    private readonly _productoByIdEmp: string = 'productos/getProductoByIdEmp';
    private get productoByIdEmp(){
      return this.apiUrl + this._productoByIdEmp;
    }
    getProductoByIdEmp<T>(idProducto: any, idEmpresa: any, accessToken: any): Observable<T>{
        const endpointUrl = this.productoByIdEmp;

        const header = this.getRequestHeaderClientes(accessToken);
        let paramsRequest = new HttpParams().set('id', idProducto).set('idEmp', idEmpresa);
        const httpOptions = {
          headers: header,
          params: paramsRequest
        }

        return this.http.get<T>(endpointUrl, httpOptions);
    }

    private readonly _insertProducto: string = "productos/insertar";
    private get insertProductoUrl(){
      return this.apiUrl + this._insertProducto;
    }
    insertProductoToBD<T>(postData: any, accessToken: any): Observable<T>{
        const endPointUrl = this.insertProductoUrl;   
        return this.http.post<T>(endPointUrl, postData, this.getRequestHeader(accessToken));
    }
    private readonly _updateProducto: string = "productos/update";
    private get updateProductoUrl(){
      return this.apiUrl + this._updateProducto;
    }
    updateProductoToBD<T>(postData: any, accessToken: any): Observable<T>{
        const endPointUrl = this.updateProductoUrl;        
        return this.http.post<T>(endPointUrl, postData, this.getRequestHeader(accessToken));
    }
    private readonly _deleteProductosByIdEmp: string = "productos/delete";
    private get deleteProductosByIdEmp(){
      return this.apiUrl + this._deleteProductosByIdEmp;
    }
    deleteProductoByIdEmpToBD<T>(idProducto: any, idEmpresa: any, accessToken: any): Observable<T>{
      const endPointUrl = this.deleteProductosByIdEmp;
      const postData = {
        'idEmpresa': idEmpresa,
        'idProducto': idProducto
      }

      return this.http.post<T>(endPointUrl,postData,  this.getRequestHeader(accessToken));
    }

    private readonly _categoriasByIdEmp: string = 'productos/getCategoriasByIdEmp';
    private get categoriasByIdEmp(){
      return this.apiUrl + this._categoriasByIdEmp;
    }
    getCategoriasByIdEmp<T>(idEmpresa: any, accessToken: any): Observable<T>{
        const endpointUrl = this.categoriasByIdEmp;

        const header = this.getRequestHeaderClientes(accessToken);
        let paramsRequest = new HttpParams().set('idEmp', idEmpresa);
        const httpOptions = {
          headers: header,
          params: paramsRequest
        }

        return this.http.get<T>(endpointUrl, httpOptions);
    }

    private readonly _marcasByIdEmp: string = 'productos/getMarcasByIdEmp';
    private get marcasByIdEmp(){
      return this.apiUrl + this._marcasByIdEmp;
    }
    getMarcasByIdEmp<T>(idEmpresa: any, accessToken: any): Observable<T>{
        const endpointUrl = this.marcasByIdEmp;

        const header = this.getRequestHeaderClientes(accessToken);
        let paramsRequest = new HttpParams().set('idEmp', idEmpresa);
        const httpOptions = {
          headers: header,
          params: paramsRequest
        }
        return this.http.get<T>(endpointUrl, httpOptions);
    }

    private readonly _searchProductosByIdEmp: string = 'productos/searchProductosByIdEmp';
    private get searchProductosByIdEmp(){
      return this.apiUrl + this._searchProductosByIdEmp;
    }
    searchProductosByIdEmpText<T>(idEmpresa: any, textSearch: any, accessToken: any): Observable<T>{
        const endpointUrl = this.searchProductosByIdEmp;

        const header = this.getRequestHeaderClientes(accessToken);
        let paramsRequest = new HttpParams().set('textSearch', textSearch).set('idEmp', idEmpresa);
        const httpOptions = {
          headers: header,
          params: paramsRequest
        }

        return this.http.get<T>(endpointUrl, httpOptions);
    }

    private readonly _searchProductosByIdEmpActivo: string = 'productos/searchProductosByIdEmpActivo';
    private get searchProductosByIdEmpActivo(){
      return this.apiUrl + this._searchProductosByIdEmpActivo;
    }
    searchProductosByIdEmpTextActivo<T>(idEmpresa: any, textSearch: any, accessToken: any): Observable<T>{
        const endpointUrl = this.searchProductosByIdEmpActivo;

        const header = this.getRequestHeaderClientes(accessToken);
        let paramsRequest = new HttpParams().set('textSearch', textSearch).set('idEmp', idEmpresa);
        const httpOptions = {
          headers: header,
          params: paramsRequest
        }

        return this.http.get<T>(endpointUrl, httpOptions);
    }

    private readonly _getProductosExcelIdEmp: string = "productos/getlistproductosexcel";
    private get getProductosExcelByIdEmpUrl(){
      return this.apiUrl + this._getProductosExcelIdEmp;
    }
    getProductosExcelById(idEmp: any, accessToken: any): Observable<Blob>{
        const endPointUrl = this.getProductosExcelByIdEmpUrl;

        const header = this.getRequestHeaderFiles(accessToken)
        const params1 = new HttpParams().set('idEmp', idEmp);

        return this.http.get(endPointUrl, {responseType: 'blob', params: params1, headers: header});
    }


    // METHODS FOR VENTAS FACTURA, TICKET , OTROS
    private readonly _insertVenta: string = "ventas/insertar";
    private get insertVentaUrl(){
      return this.apiUrl + this._insertVenta;
    }
    insertVentaToBD<T>(postData: any, accessToken: any): Observable<T>{
        const endPointUrl = this.insertVentaUrl;   
        return this.http.post<T>(endPointUrl, postData, this.getRequestHeader(accessToken));
    }
    private readonly _updateEstadoVenta: string = "ventas/updateEstadoVenta";
    private get updateEstadoVentaUrl(){
      return this.apiUrl + this._updateEstadoVenta;
    }
    updateEstadoVentaToBD<T>(postData: any, accessToken: any): Observable<T>{
        const endPointUrl = this.updateEstadoVentaUrl;   
        return this.http.post<T>(endPointUrl, postData, this.getRequestHeader(accessToken));
    }
    
    private readonly _deleteVenta: string = "ventas/deleteVenta";
    private get deleteVentaUrl(){
      return this.apiUrl + this._deleteVenta;
    }
    deleteVentaToBD<T>(postData: any, accessToken: any): Observable<T>{
        const endPointUrl = this.deleteVentaUrl;   
        return this.http.post<T>(endPointUrl, postData, this.getRequestHeader(accessToken));
    }

    private readonly _listaVentasByIdEmp: string = 'ventas/listaVentasIdEmp';
    private get listaVentasByIdEmp(){
      return this.apiUrl + this._listaVentasByIdEmp;
    }
    getListaVentasByIdEmp<T>(idEmpresa: any, nombreCi: any, noDoc: any, fechaIni: any, 
      fechaFin: any, accessToken: any): Observable<T>{
      const endpointUrl = this.listaVentasByIdEmp;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmpresa).set('ciname',nombreCi)
                            .set('nodoc',noDoc).set('fechaini',fechaIni)
                            .set('fechafin',fechaFin);

      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }
    private readonly _dataByIdVenta: string = 'ventas/getDataByIdVenta';
    private get dataByIdVenta(){
      return this.apiUrl + this._dataByIdVenta;
    }
    getDataByIdVenta<T>(idVenta: any, idEmpresa: any,rucEmpresa: any, accessToken: any): Observable<T>{
      const endpointUrl = this.dataByIdVenta;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmpresa).set('id', idVenta).set('ruc',rucEmpresa);

      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }
    private readonly _listaResumenVentasByIdEmp: string = 'ventas/listaResumenVentasIdEmp';
    private get listaResumenVentasByIdEmp(){
      return this.apiUrl + this._listaResumenVentasByIdEmp;
    }
    getListaResumenVentasByIdEmp<T>(idEmpresa: any, nombreCi: any, noDoc: any, fechaIni: any, 
      fechaFin: any, accessToken: any): Observable<T>{
      const endpointUrl = this.listaResumenVentasByIdEmp;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmpresa).set('ciname',nombreCi)
                            .set('nodoc',noDoc).set('fechaini',fechaIni)
                            .set('fechafin',fechaFin);

      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }
    private readonly _getOrCreateConsumidorFinalByIdEmp: string = 'ventas/getorcreateconsfinalbyidemp';
    private get consumidorFinalByIdEmp(){
      return this.apiUrl + this._getOrCreateConsumidorFinalByIdEmp;
    }
    getConsumidorFinalByIdEmp<T>(idEmpresa: any,accessToken: any): Observable<T>{
      const endpointUrl = this.consumidorFinalByIdEmp;
      
      const header = this.getRequestHeaderClientes(accessToken);
      let paramsRequest = new HttpParams().set('idEmp', idEmpresa)
      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }
    private readonly _nextNumeroSecuencialByIdEmp: string = 'ventas/getNextNumeroSecuencialByIdEmp';
    private get nextNumeroSecuencialByIdEmp(){
      return this.apiUrl + this._nextNumeroSecuencialByIdEmp;
    }
    getNextNumeroSecuencialByIdEmp<T>(idEmpresa: any,tipoDoc: any, fac001: any, fac002: any, accessToken: any): Observable<T>{
      const endpointUrl = this.nextNumeroSecuencialByIdEmp;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmpresa).set('tipoDoc',tipoDoc)
                            .set('fac001',fac001).set('fac002',fac002);

      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }
    private readonly _nextNoPuntoVentaByUsr: string = 'ventas/getNoPuntoVentaByIdUsr';
    private get nextNoPuntoVentaByUsrURL(){
      return this.apiUrl + this._nextNoPuntoVentaByUsr;
    }
    getNextNoPuntoVentaByUsr<T>(idEmpresa: any,tipoDoc: any,idUsuario: any, accessToken: any): Observable<T>{
      const endpointUrl = this.nextNoPuntoVentaByUsrURL;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmpresa).set('tipoDoc',tipoDoc).set('idUsuario', idUsuario)

      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }



    private readonly _listaVentasExcelByIdEmp: string = 'ventas/getlistventasexcel';
    private get listaVentasExcelByIdEmpUrl(){
      return this.apiUrl + this._listaVentasExcelByIdEmp;
    }
    getListaVentasExcelByIdEmp(idEmpresa: any, nombreCi: any, noDoc: any, fechaIni: any, 
      fechaFin: any, accessToken: any): Observable<any>{
      const endpointUrl = this.listaVentasExcelByIdEmpUrl;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmpresa).set('ciname',nombreCi)
                            .set('nodoc',noDoc).set('fechaIni',fechaIni)
                            .set('fechaFin',fechaFin);

      return this.http.get(endpointUrl, {responseType: 'blob', params: paramsRequest, headers: header});      
    }

    private readonly _listaResumenVentasExcelByIdEmp: string = 'ventas/getlistresumenventasexcel';
    private get listaResumenVentasExcelByIdEmpUrl(){
      return this.apiUrl + this._listaResumenVentasExcelByIdEmp;
    }
    getListaResumenVentasExcelByIdEmp(idEmpresa: any, nombreCi: any, noDoc: any, fechaIni: any, 
      fechaFin: any, accessToken: any): Observable<any>{
      const endpointUrl = this.listaResumenVentasExcelByIdEmpUrl;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmpresa).set('ciname',nombreCi)
                            .set('nodoc',noDoc).set('fechaIni',fechaIni)
                            .set('fechaFin',fechaFin);

      return this.http.get(endpointUrl, {responseType: 'blob', params: paramsRequest, headers: header});
      
    }

    // METHODS FOR COMPRAS
    private readonly _insertCompra: string = "compras/insertar";
    private get insertCompraUrl(){
      return this.apiUrl + this._insertCompra;
    }
    insertCompraToBD<T>(postData: any, accessToken: any): Observable<T>{
        const endPointUrl = this.insertCompraUrl;   
        return this.http.post<T>(endPointUrl, postData, this.getRequestHeader(accessToken));
    }

    private readonly _listaComprasByIdEmp: string = 'compras/listaComprasByIdEmp';
    private get listaComprasByIdEmp(){
      return this.apiUrl + this._listaComprasByIdEmp;
    }
    getListaComprasByIdEmp<T>(idEmpresa: any, nombreCi: any, noDoc: any, fechaIni: any, 
      fechaFin: any, accessToken: any): Observable<T>{
      const endpointUrl = this.listaComprasByIdEmp;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmpresa).set('ciname',nombreCi)
                            .set('nodoc',noDoc).set('fechaini',fechaIni)
                            .set('fechafin',fechaFin);

      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }
    private readonly _listaResumenComprasByIdEmp: string = 'compras/listaResumenComprasIdEmp';
    private get listaResumenComprasByIdEmp(){
      return this.apiUrl + this._listaResumenComprasByIdEmp;
    }
    getListaResumenComprasByIdEmp<T>(idEmpresa: any, nombreCi: any, noDoc: any, fechaIni: any, 
      fechaFin: any, accessToken: any): Observable<T>{
      const endpointUrl = this.listaResumenComprasByIdEmp;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmpresa).set('ciname',nombreCi)
                            .set('nodoc',noDoc).set('fechaini',fechaIni)
                            .set('fechafin',fechaFin);

      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }
    private readonly _getOrCreateProveedorGenericoByIdEmp: string = 'compras/getorcreateprovgenericobyidemp';
    private get proveedorGenericoByIdEmp(){
      return this.apiUrl + this._getOrCreateProveedorGenericoByIdEmp;
    }
    getProveedorGenericoByIdEmp<T>(idEmpresa: any,accessToken: any): Observable<T>{
      const endpointUrl = this.proveedorGenericoByIdEmp;
      
      const header = this.getRequestHeaderClientes(accessToken);
      let paramsRequest = new HttpParams().set('idEmp', idEmpresa)
      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }

    private readonly _nextNumeroSecuencialCompraByIdEmp: string = 'compras/getNextNumeroSecuencialByIdEmp';
    private get nextNumeroSecuencialCompraByIdEmp(){
      return this.apiUrl + this._nextNumeroSecuencialCompraByIdEmp;
    }
    getNextNumeroSecuencialCompraByIdEmp<T>(idEmpresa: any,tipoDoc: any, 
                idProveedor: any, compraNumero: any, accessToken: any): Observable<T>{
      const endpointUrl = this.nextNumeroSecuencialCompraByIdEmp;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmpresa).set('tipoDoc',tipoDoc)
                            .set('idProveedor',idProveedor).set('compraNumero',compraNumero);

      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }

    private readonly _deleteCompra: string = "compras/deleteCompra";
    private get deleteCompraUrl(){
      return this.apiUrl + this._deleteCompra;
    }
    deleteCompraToBD<T>(postData: any, accessToken: any): Observable<T>{
        const endPointUrl = this.deleteCompraUrl;   
        return this.http.post<T>(endPointUrl, postData, this.getRequestHeader(accessToken));
    }
    private readonly _dataByIdCompra: string = 'compras/getDataByIdCompra';
    private get dataByIdCompra(){
      return this.apiUrl + this._dataByIdCompra;
    }
    getDataByIdCompra<T>(idVenta: any, idEmpresa: any,accessToken: any): Observable<T>{
      const endpointUrl = this.dataByIdCompra;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmpresa).set('id', idVenta);

      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }

    private readonly _listaComprasExcelByIdEmp: string = 'compras/getlistcomprasexcel';
    private get listaComprasExcelByIdEmpUrl(){
      return this.apiUrl + this._listaComprasExcelByIdEmp;
    }
    getListaComprasExcelByIdEmp(idEmpresa: any, nombreCi: any, noDoc: any, fechaIni: any, 
      fechaFin: any, accessToken: any): Observable<any>{
      const endpointUrl = this.listaComprasExcelByIdEmpUrl;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmpresa).set('ciname',nombreCi)
                            .set('nodoc',noDoc).set('fechaIni',fechaIni)
                            .set('fechaFin',fechaFin);

      return this.http.get(endpointUrl, {responseType: 'blob', params: paramsRequest, headers: header});      
    }

    private readonly _listaResumenComprasExcelByIdEmp: string = 'compras/getlistresumencomprasexcel';
    private get listaResumenComprasExcelByIdEmpUrl(){
      return this.apiUrl + this._listaResumenComprasExcelByIdEmp;
    }
    getListaResumenComprasExcelByIdEmp(idEmpresa: any, nombreCi: any, noDoc: any, fechaIni: any, 
      fechaFin: any, accessToken: any): Observable<any>{
      const endpointUrl = this.listaResumenComprasExcelByIdEmpUrl;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmpresa).set('ciname',nombreCi)
                            .set('nodoc',noDoc).set('fechaIni',fechaIni)
                            .set('fechaFin',fechaFin);


      return this.http.get(endpointUrl, {responseType: 'blob', params: paramsRequest, headers: header});
      
    }


    //METHODS FOR CAJA REQUEST
    private readonly _listaMovimientosCajaByIdEmp: string = 'caja/listaResumenCajaIdEmp';
    private get listaMovimientosCajaByIdEmp(){
      return this.apiUrl + this._listaMovimientosCajaByIdEmp;
    }
    getListaMovimientosCajaByIdEmp<T>(idEmpresa: any, nombreUsuario: any, tipo: any, 
      concepto: any, fechaIni: any, fechaFin: any, accessToken: any): Observable<T>{
      const endpointUrl = this.listaMovimientosCajaByIdEmp;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmpresa).set('idUsu',nombreUsuario)
                            .set('tipo',tipo).set('concepto',concepto).set('fechaini',fechaIni)
                            .set('fechafin',fechaFin);

      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }

    private readonly _listaMovimientosCuadrarCajaByIdEmp: string = 'caja/listcuadrecajamovimientosidemp';
    private get listaMovimientosCuadrarCajaByIdEmp(){
      return this.apiUrl + this._listaMovimientosCuadrarCajaByIdEmp;
    }
    getListaMovimientosCuadrarCajaByIdEmp<T>(idEmpresa: any, idUsuario: any,
                                  fechaIni: any, fechaFin: any, accessToken: any): Observable<T>{
      const endpointUrl = this.listaMovimientosCuadrarCajaByIdEmp;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmpresa).set('idUser',idUsuario)
                            .set('fechaIni',fechaIni).set('fechaFin',fechaFin);

      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }
    private readonly _valorCajaByIdEmp: string = 'caja/getvalorcajabyidemp';
    private get valorCajaByIdEmp(){
      return this.apiUrl + this._valorCajaByIdEmp;
    }
    getValorCajaByIdEmp<T>(idEmpresa: any, accessToken: any): Observable<T>{
      const endpointUrl = this.valorCajaByIdEmp;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmpresa);

      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }
    private readonly _insertCuadreCajaByIdEmp: string = "caja/cuadrarcaja";
    private get insertCuadreCajaUrl(){
      return this.apiUrl + this._insertCuadreCajaByIdEmp;
    }
    insertCuadreCajaToBD<T>(postData: any, accessToken: any): Observable<T>{
        const endPointUrl = this.insertCuadreCajaUrl;   
        return this.http.post<T>(endPointUrl, postData, this.getRequestHeader(accessToken));
    }

    private readonly _insertBitacoraIngresoEgresoByIdEmp: string = "caja/insertingresoegreso";
    private get insertIngresoEgresoByIdEmpUrl(){
      return this.apiUrl + this._insertBitacoraIngresoEgresoByIdEmp;
    }
    insertIngresoEgresoToBD<T>(postData: any, accessToken: any): Observable<T>{
        const endPointUrl = this.insertIngresoEgresoByIdEmpUrl;   
        return this.http.post<T>(endPointUrl, postData, this.getRequestHeader(accessToken));
    }
    private readonly _listaMovCajaExcelByIdEmp: string = 'caja/getlistmovimientoscajaexcel';
    private get listaMovCajaExcelByIdEmpUrl(){
      return this.apiUrl + this._listaMovCajaExcelByIdEmp;
    }
    getListaMoviCajaExcelByIdEmp(idEmpresa: any, nombreUsuario: any, tipo: any, 
      concepto: any, fechaIni: any, fechaFin: any, accessToken: any): Observable<any>{
      const endpointUrl = this.listaMovCajaExcelByIdEmpUrl;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmpresa).set('idUsu',nombreUsuario)
                            .set('tipo',tipo).set('concepto',concepto).set('fechaini',fechaIni)
                            .set('fechafin',fechaFin);


      return this.http.get(endpointUrl, {responseType: 'blob', params: paramsRequest, headers: header});
      
    }


    //METHODS FOR CONFIGURACIONES
    private readonly _insertListConfigs: string = "configs/insertarlist";
    private get insertListConfigsUrl(){
      return this.apiUrl + this._insertListConfigs;
    }
    insertListConfigsToBD<T>(postData: any, accessToken: any): Observable<T>{
        const endPointUrl = this.insertListConfigsUrl;
        
        return this.http.post<T>(endPointUrl, postData, this.getRequestHeader(accessToken));
    }

    private readonly _insertListConfigsFacElec: string = "configs/insertarlistconfigfacelec";
    private get insertListConfigsFacElecURL(){
      return this.apiUrl + this._insertListConfigsFacElec;
    }
    insertListConfigsFacElec<T>(postData: any, accessToken: any): Observable<T>{
        const endPointUrl = this.insertListConfigsFacElecURL;
        
        return this.http.post<T>(endPointUrl, postData, this.getRequestHeader(accessToken));
    }

    private readonly _insertFirmaElectronicaConfig: string = "configsfile/insertfilefirmaelec";
    private get insertFirmaElectronicaConfigURL(){
      return this.apiUrl + this._insertFirmaElectronicaConfig;
    }
    insertFirmaElectronicaConfig(postData: any, fileFirma: any, accessToken: any): Observable<any>{
        const endPointUrl = this.insertFirmaElectronicaConfigURL;
      
        let formData = new FormData();
        formData.append("file", fileFirma);
        formData.append("claveFirma", postData['claveFirma']);
        formData.append("ruc", postData['ruc']);

        return this.http.post(endPointUrl, formData, this.getRequestHeaderMultipart(accessToken));
    }

    private readonly _getListConfigsByIdEmp: string = 'configs/listConfigsIdEmp';
    private get getListConfigByIdEmp(){
      return this.apiUrl + this._getListConfigsByIdEmp;
    }
    getListConfigsByIdEmp<T>(idEmpresa: any,accessToken: any): Observable<T>{
      const endpointUrl = this.getListConfigByIdEmp;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmpresa)

      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }

    private readonly _getListConfigsFirmaElectronicaByIdEmp: string = 'configs/getConfigFirmaNameAndClaveByRuc';
    private get getListConfigsFirmaElectronicaByIdEmpURL(){
      return this.apiUrl + this._getListConfigsFirmaElectronicaByIdEmp;
    }
    getListConfigsFirmaElectronicaByIdEmp<T>(rucEmpresa: any,accessToken: any): Observable<T>{
      const endpointUrl = this.getListConfigsFirmaElectronicaByIdEmpURL;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('ruc', rucEmpresa)

      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }

    private readonly _getConfigByIdEmp: string = 'configs/getConfigByIdEmp';
    private get getConfigsByIdEmp(){
      return this.apiUrl + this._getConfigByIdEmp;
    }
    getConfigByIdEmp<T>(idEmpresa: any,nombreConfig: any, accessToken: any): Observable<T>{
      const endpointUrl = this.getConfigsByIdEmp;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmpresa)
                                    .set('nombreConfig', nombreConfig)

      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }

    // DASHBOARD METHODS
    private readonly _getVentaDiariaValueByIdEmp: string = 'dashboard/getinfoventadiaria';
    private get getVentaDiariaValueByIdEmp(){
      return this.apiUrl + this._getVentaDiariaValueByIdEmp;
    }
    getValorVentaDiariaByIdEmp<T>(idEmpresa: any,fechaIni:any,fechaFin:any, accessToken: any): Observable<T>{
      const endpointUrl = this.getVentaDiariaValueByIdEmp;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmpresa)
                          .set('fechaIni',fechaIni).set('fechaFin',fechaFin)

      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }
    private readonly _getVentaMensualValueByIdEmp: string = 'dashboard/getinfoventamensual';
    private get getVentaMensualValueByIdEmp(){
      return this.apiUrl + this._getVentaMensualValueByIdEmp;
    }
    getValorVentaMensualByIdEmp<T>(idEmpresa: any,fechaIni:any,fechaFin:any, accessToken: any): Observable<T>{
      const endpointUrl = this.getVentaMensualValueByIdEmp;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmpresa)
                          .set('fechaIni',fechaIni).set('fechaFin',fechaFin)

      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }
    private readonly _getInfoClientesRegistradosByIdEmp: string = 'dashboard/getinfoclientesregistrados';
    private get getInfoClientesRegistradosByIdEmp(){
      return this.apiUrl + this._getInfoClientesRegistradosByIdEmp;
    }
    getInfoClientesRegistradosIdEmp<T>(idEmpresa: any,accessToken: any): Observable<T>{
      const endpointUrl = this.getInfoClientesRegistradosByIdEmp;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmpresa)

      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }
    private readonly _getInfoProductosRegistradosByIdEmp: string = 'dashboard/getinfoproductosregistrados';
    private get getInfoProductosRegistradosByIdEmp(){
      return this.apiUrl + this._getInfoProductosRegistradosByIdEmp;
    }
    getInfoProductosRegistradosIdEmp<T>(idEmpresa: any,accessToken: any): Observable<T>{
      const endpointUrl = this.getInfoProductosRegistradosByIdEmp;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmpresa)

      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }
    private readonly _getNumDocAndLicenceDaysRucEmp: string = 'dashboard/getnumdocslicencedays';
    private get getNumDocAndLicenceDaysRucEmp(){
      return this.apiUrl + this._getNumDocAndLicenceDaysRucEmp;
    }
    getNumeroDocsAndLicenceDays<T>(rucEmp: any,accessToken: any): Observable<T>{
      const endpointUrl = this.getNumDocAndLicenceDaysRucEmp;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('rucEmp', rucEmp)

      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }
    private readonly _getProductosDelMes: string = 'dashboard/getproductosdelmes';
    private get getProductosDelMes(){
      return this.apiUrl + this._getProductosDelMes;
    }
    getProductosDelMesIdEmp<T>(idEmp: any,fechaIni:any,fechaFin:any,accessToken: any): Observable<T>{
      const endpointUrl = this.getProductosDelMes;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmp)
                        .set('fechaIni', fechaIni).set('fechaFin', fechaFin)
      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }
    private readonly _getClientesDelMes: string = 'dashboard/getclientesdelmes';
    private get getClientesDelMes(){
      return this.apiUrl + this._getClientesDelMes;
    }
    getClientesDelMesIdEmp<T>(idEmp: any,fechaIni:any,fechaFin:any,accessToken: any): Observable<T>{
      const endpointUrl = this.getClientesDelMes;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmp)
                        .set('fechaIni', fechaIni).set('fechaFin', fechaFin)
      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }

    private readonly _getVentasDelDiaFormaPago: string = 'dashboard/getventasdeldiaformapago';
    private get getVentasDelDiaFormaPagoUrl(){
      return this.apiUrl + this._getVentasDelDiaFormaPago;
    }
    getVentaDelDiaFormaPago<T>(idEmp: any,fechaIni:any,fechaFin:any,accessToken: any): Observable<T>{
      const endpointUrl = this.getVentasDelDiaFormaPagoUrl;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmp)
                        .set('fechaIni', fechaIni).set('fechaFin', fechaFin)
      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }


    // DOCUMENTOS ELECTRONICOS
    private readonly _getDocumentosElectronicosByIdEmp: string = 'documentos_electronicos/getlistdocumentoselectronicos';
    private get getDocumentosElectronicosByIdEmpURL(){
      return this.apiUrl + this._getDocumentosElectronicosByIdEmp;
    }
    getDocumentosElectronicosByIdEmp<T>(idEmp: any,fechaIni:any,fechaFin:any,
                        tipo:any,nombresci:any,nodoc:any,accessToken: any): Observable<T>{
      const endpointUrl = this.getDocumentosElectronicosByIdEmpURL;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmp)
                        .set('fechaIni', fechaIni).set('fechaFin', fechaFin)
                        .set('tipo', tipo).set('nodoc', nodoc)
                        .set('nombresci', nombresci)

      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }

    private readonly _getDocumentosElectronicosByIdEmpNoAutorizados: string = 'documentos_electronicos/getlistdocumentoselectronicosnoautorizados';
    private get getDocumentosElectronicosByIdEmpNoAutorizadosURL(){
      return this.apiUrl + this._getDocumentosElectronicosByIdEmpNoAutorizados;
    }
    getDocumentosElectronicosByIdEmpNoAutorizados<T>(idEmp: any,accessToken: any): Observable<T>{
      const endpointUrl = this.getDocumentosElectronicosByIdEmpNoAutorizadosURL;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmp)

      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }

    private readonly _getPDFVentaByIdEmp: string = 'documentos_electronicos/generatepdffromventa';
    private get getPDFVentaByIdEmpURL(){
      return this.apiUrl + this._getPDFVentaByIdEmp;
    }
    getPDFVentaByIdEmp(idEmp: any,identificacion: any,idVentaCompra: any, accessToken: any): Observable<Blob>{
      const endpointUrl = this.getPDFVentaByIdEmpURL;
      
      const header = this.getRequestHeaderFilesPDF(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmp)
                            .set('idVentaCompra', idVentaCompra)
                            .set('identificacion', identificacion)

      return this.http.get(endpointUrl,{responseType: 'blob', params: paramsRequest, headers: header});
    }
    private readonly _autorizarDocumentoElectronicaByIdEmp: string = 'documentos_electronicos/autorizardocumentoelectronico';
    private get autorizarDocumentoElectronicaByIdEmpURL(){
      return this.apiUrl + this._autorizarDocumentoElectronicaByIdEmp;
    }
    autorizarDocumentosElectronicosByIdEmp<T>(idEmp: any,idVentaCompra: number,identificacion: string,tipo: any,accessToken: any, estado: any): Observable<T>{
      const endpointUrl = this.autorizarDocumentoElectronicaByIdEmpURL;
      
      const header = this.getRequestHeaderClientes(accessToken);

      let paramsRequest = new HttpParams().set('idEmp', idEmp)
                        .set('idVentaCompra', idVentaCompra).set('identificacion', identificacion)
                        .set('tipo', tipo).set('estado', estado)

      const httpOptions = {
        headers: header,
        params: paramsRequest
      }

      return this.http.get<T>(endpointUrl, httpOptions);
    }

    private readonly _autorizarListDocumentoElectronicaByIdEmp: string = "documentos_electronicos/autorizarlistdocumentosbyid";
    private get autorizarListDocumentoElectronicaByIdEmpURL(){
      return this.apiUrl + this._autorizarListDocumentoElectronicaByIdEmp;
    }
    autorizarListDocumentoElectronicaByIdEmp<T>(postData: any, accessToken: any): Observable<T>{
        const endPointUrl = this.autorizarListDocumentoElectronicaByIdEmpURL;
        
        return this.http.post<T>(endPointUrl, postData, this.getRequestHeader(accessToken));
    }


    private readonly _getDocElectronicosExcelIdEmp: string = "documentos_electronicos/getlistdocumentoselectronicosexcel";
    private get getDocElectronicosExcelIdEmpURL(){
      return this.apiUrl + this._getDocElectronicosExcelIdEmp;
    }
    getDocElectronicosExcelIdEmp(idEmp: any,rucEmpresa: any, fechaIni:any,fechaFin:any,
                                tipo:any,nombresci:any,nodoc:any, accessToken: any): Observable<Blob>{
                                  
        const endPointUrl = this.getDocElectronicosExcelIdEmpURL;

        const header = this.getRequestHeaderFiles(accessToken)
        const params1 = new HttpParams().set('idEmp', idEmp).set('rucEmp', rucEmpresa) .set('fechaIni', fechaIni)
          .set('fechaFin', fechaFin).set('tipo', tipo).set('nodoc', nodoc).set('nombresci', nombresci);

        return this.http.get(endPointUrl, {responseType: 'blob', params: params1, headers: header});
    }


    //---------------------------------------------------------------

    getRequestHeaderMultipart(accesToken: any): {
      headers: HttpHeaders | { [header: string]: string | string[];}
    } | undefined{

        if(new Date(accesToken.expire) > new Date()){
          const header = new HttpHeaders({
              'Authorization': 'Bearer ' + accesToken.token,
              //'Content-Type': 'multipart/form-data'
          });
          return { headers: header };
        }else{

          this.router.navigate(['/login']);
          return;
        }
    }

    getRequestHeader(accesToken: any): {
      headers: HttpHeaders | { [header: string]: string | string[];}
    } | undefined{

        if(new Date(accesToken.expire) > new Date()){
          const header = new HttpHeaders({
              'Authorization': 'Bearer ' + accesToken.token,
              'Content-Type': 'application/json'
          });
          return { headers: header };
        }else{

          this.router.navigate(['/login']);
          return;
        }
    }

    getRequestHeaderSearchCliente(): HttpHeaders {

        const header = new HttpHeaders({
          'Content-Type': 'text/html'
        });

        return header;

    }

    getRequestHeaderClientes(accesToken: any): HttpHeaders | {}{
      if(new Date(accesToken.expire) > new Date()){
        const header = new HttpHeaders({
            'Authorization': 'Bearer ' + accesToken.token,
            'Content-Type': 'application/json'
        });
        return header
      }else{
        this.router.navigate(['/login']);
        return {};
      }
    }

    getRequestHeaderFiles(accesToken: any): HttpHeaders | {}{
      if(new Date(accesToken.expire) > new Date()){
        const header = new HttpHeaders({
            'Authorization': 'Bearer ' + accesToken.token,
            
        });
        return header
      }else{
        this.router.navigate(['/login']);
        return {};
      }
    }

    getRequestHeaderFilesPDF(accesToken: any): HttpHeaders | {}{
      if(new Date(accesToken.expire) > new Date()){
        const header = new HttpHeaders({
            'Authorization': 'Bearer ' + accesToken.token,
            Accept: "application/pdf"
        });
        return header
      }else{
        this.router.navigate(['/login']);
        return {};
      }
    }
}
