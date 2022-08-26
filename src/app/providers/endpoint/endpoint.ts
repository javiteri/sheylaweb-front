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
    private readonly apiUrl = 'http://localhost:3000/api/';

    private readonly searchDatosClienteSri = 'http://sheyla2.dyndns.info/SRI/SRI.php';
    private readonly searchDatosClienteSriLocal = 'http://localhost:4200/SRI';

    //SEARCH CLIENT BY CI OR RUC
    searchClientByCiRuc(ciRuc: any): Observable<string>{

      const header = this.getRequestHeaderSearchCliente();

      let paramsRequest = new HttpParams().set('ruc', ciRuc).set('actualizado', 'Y');
      const httpOptions = {
        headers: header,
        params: ciRuc ? paramsRequest : {}
      }
      
      return this.http.get(this.searchDatosClienteSriLocal, {params: paramsRequest, responseType: 'text'});
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

     // METHODS FOR PROVEEDORES
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

        this.router.navigate(['/login']);
        return {};
      }
    }

}
