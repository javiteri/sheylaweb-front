import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class EndPointProvider {


    constructor(private http: HttpClient){}

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



    //---------------------------------------------------------------
    getRequestHeader(accesToken: any): {
      headers: HttpHeaders | { [header: string]: string | string[];}
    }{
        const header = new HttpHeaders({
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjEyMzMxMjMxMjMifSwiZXhwIjoxNjU5NjM1NjE3MzI3LCJpYXQiOjE2NTk1NDkyMTd9.Yk_lw68Zr7BrqSNQeeXdpZgAlb6s6KK1UjTAIlz8oRI',
          'Content-Type': 'application/json'
        });

        return { headers: header}

        /*if(new Date(accesToken.expires) > new Date()){
            const header = new HttpHeaders({
              'Authorization': 'Bearer ' + accesToken.token,
              'Content-Type': 'application/json'
            });
            return { headers: header };
        }else{
          const header = new HttpHeaders({
            'Authorization': 'Bearer ',
            'Content-Type': 'application/json'
          });

          return { headers: header}
        }*/
    }

}
