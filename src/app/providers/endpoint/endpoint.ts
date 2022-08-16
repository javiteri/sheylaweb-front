import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
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

}
