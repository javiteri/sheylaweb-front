import { Component, OnInit } from '@angular/core';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  idEmpresa: number = 0;
  rucEmpresa: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  
  ventaDiariaValue = "0.00";
  ventaMensualValue = "0.00";
  clientesRegistradosValue = "0";
  productosRegistradosValue = "0";
  documentosEmitidosValue = "0";

  constructor(
    private coreService: ApplicationProvider
  ) { }

  ngOnInit(): void {
     // GET INITIAL DATA 
     const localServiceResponseToken =  
     JSON.parse(sessionStorage.getItem('_valtok') ? sessionStorage.getItem('_valtok')! : '');
    const localServiceResponseUsr = 
        JSON.parse(sessionStorage.getItem('_valuser') ? sessionStorage.getItem('_valuser')! : '');

    this.dataUser = localServiceResponseToken;
    const { token, expire } = this.dataUser;
    this.tokenValidate = { token, expire};

    this.idEmpresa = localServiceResponseUsr._bussId;
    this.rucEmpresa = localServiceResponseUsr._ruc;

    this.getVentaDiariaValue();
    this.getVentaMensualValue();
    this.getClientesRegistradosValue();
    this.getProductosRegistradosValue();
    this.getNumeroDocsAndLicenceDays();
  }


  private getVentaDiariaValue(): void {
     this.coreService.getValueVentaDiaria(this.idEmpresa,'','',this.tokenValidate).subscribe({
      next: (data: any) => {
        if(data.data && data.data[0].total){
          this.ventaDiariaValue = data.data[0].total
        }

      },
      error: (error: any) => {
        console.log('inside error get venta diria');
      }
     });
  }

  private getVentaMensualValue(): void {
    
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const dateInitString = '' + firstDay.getFullYear() + '-' + ('0' + (firstDay.getMonth()+1)).slice(-2) + 
                          '-' + ('0' + firstDay.getDate()).slice(-2) + ' ' + 
                            '00:00:00' ;
    const dateFinString = '' + lastDay.getFullYear() + '-' + ('0' + (lastDay.getMonth()+1)).slice(-2) + 
                            '-' + ('0' + lastDay.getDate()).slice(-2) + ' ' + 
                              '23:59:59' ;

    this.coreService.getValueVentaMensuual(this.idEmpresa,dateInitString,dateFinString,this.tokenValidate).subscribe({
     next: (data: any) => {
      console.log(data);
       if(data.data && data.data[0].total){
         this.ventaMensualValue = data.data[0].total
         console.log(data);
       }

     },
     error: (error: any) => {
       console.log('inside error get venta mensual');
     }
    });
 }

 private getClientesRegistradosValue(): void{
  this.coreService.getInfoClientesRegistrados(this.idEmpresa,this.tokenValidate).subscribe({
    next: (data: any) =>{
      if(data.data && data.data[0].total){
        this.clientesRegistradosValue = data.data[0].total;
      }
    },
    error: (error: any) => {

    }
  });
 }

 private getProductosRegistradosValue(): void{
  this.coreService.getInfoProductosRegistrados(this.idEmpresa,this.tokenValidate).subscribe({
    next: (data: any) =>{
      if(data.data && data.data[0].total){
        this.productosRegistradosValue = data.data[0].total;
      }
    },
    error: (error: any) => {

    }
  });
 }

 private getNumeroDocsAndLicenceDays(): void{
  this.coreService.getNumDocAndLicenceDays(this.rucEmpresa,this.tokenValidate).subscribe({
    next: (data: any) =>{
      console.log('inside num doc');
      console.log(data);
      if(data.data && data.data[0].emitidos){
        this.documentosEmitidosValue = data.data[0].emitidos;
      }
    },
    error: (error: any) => {

    }
  });
 }

}
