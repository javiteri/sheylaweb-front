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
    private readonly apiUrl = 'http://192.168.1.10:8086/api/';
    //private readonly apiUrl = 'http://localhost:3000/api/';  

    private readonly searchDatosClienteSri = 'http://sheyla2.dyndns.info/SRI/SRI.php';
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

    //LOGUIN
    private readonly _loginVerify: string = 'loginverify'

    private get loginVerifyUrl(){
      return this.apiUrl + this._loginVerify;
    }
    loginVerify<T>(postData: any): Observable<T>{
      const endPointUrl = this.loginVerifyUrl;
      return this.http.post<T>(endPointUrl, postData);
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


    //---------------------------------------------------------------
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

        console.log('inside router login');
        this.router.navigate(['/login']);
        return {};
      }
    }

}
