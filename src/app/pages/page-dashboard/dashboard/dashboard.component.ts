import { Component, OnInit } from '@angular/core';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import {Chart, registerables} from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  listLabelProductosMes: any[] = [];
  listLabelProductosMesValue: any[] = [];
  listLabelClientesMes: any[] = [];
  chartProductos: any;
  chartClientes: any;
  chartFormasPago: any;

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
  ) { 

  }

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
    this.getClientesDelMes();
    this.getProductosDelMes();

    //this.createChartProductos();
    //this.createChartClientes();
    this.createChartFormaPago();
  }


  private getVentaDiariaValue(): void {

    const firstDay = new Date();

    const dateInitString = '' + firstDay.getFullYear() + '-' + ('0' + (firstDay.getMonth()+1)).slice(-2) + 
                          '-' + ('0' + firstDay.getDate()).slice(-2) + ' ' + 
                            '00:00:00' ;
    const dateFinString = '' + firstDay.getFullYear() + '-' + ('0' + (firstDay.getMonth()+1)).slice(-2) + 
                            '-' + ('0' + firstDay.getDate()).slice(-2) + ' ' + 
                              '23:59:59' ;


     this.coreService.getValueVentaDiaria(this.idEmpresa,dateInitString,dateFinString,this.tokenValidate).subscribe({
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
       if(data.data && data.data[0].total){
         this.ventaMensualValue = data.data[0].total         
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
      if(data.data && data.data[0].emitidos){
        this.documentosEmitidosValue = data.data[0].emitidos;
      }
    },
    error: (error: any) => {

    }
  });
 }

 private getProductosDelMes(): void{

  const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const dateInitString = '' + firstDay.getFullYear() + '-' + ('0' + (firstDay.getMonth()+1)).slice(-2) + 
                          '-' + ('0' + firstDay.getDate()).slice(-2) + ' ' + 
                            '00:00:00' ;
    const dateFinString = '' + lastDay.getFullYear() + '-' + ('0' + (lastDay.getMonth()+1)).slice(-2) + 
                            '-' + ('0' + lastDay.getDate()).slice(-2) + ' ' + 
                              '23:59:59' ;


  this.coreService.getProductosDelMes(this.idEmpresa,dateInitString,dateFinString,this.tokenValidate).subscribe({
    next: (data: any) =>{
      console.log('inside productos del mes');
      console.log(data);
      if(data.data){

        const listLabel = Array.from(data.data).map((valor: any) => valor.ventad_producto.split(' '));
        const listValue = Array.from(data.data).map((valor: any) => valor.cantidad);

        this.listLabelProductosMes = listLabel;
        this.listLabelProductosMesValue = listValue;
        console.log(listLabel);
        this.createChartProductos();
      }
    },
    error: (error: any) => {
      console.log('error inside productos del mes');
    }
  });
 }

 private getClientesDelMes(): void{

  const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const dateInitString = '' + firstDay.getFullYear() + '-' + ('0' + (firstDay.getMonth()+1)).slice(-2) + 
                          '-' + ('0' + firstDay.getDate()).slice(-2) + ' ' + 
                            '00:00:00' ;
    const dateFinString = '' + lastDay.getFullYear() + '-' + ('0' + (lastDay.getMonth()+1)).slice(-2) + 
                            '-' + ('0' + lastDay.getDate()).slice(-2) + ' ' + 
                              '23:59:59' ;


  this.coreService.getClientesDelMes(this.idEmpresa,dateInitString,dateFinString,this.tokenValidate).subscribe({
    next: (data: any) =>{
      console.log('inside clientes del mes');
      console.log(data);
      if(data.data){
        const listLabel = Array.from(data.data).map((valor: any) => valor.cli_nombres_natural.split(' '));
        this.listLabelClientesMes = listLabel;
        console.log(listLabel);
        this.createChartClientes();
      }
    },
    error: (error: any) => {
      console.log('error inside clientes del mes');
    }
  });
 }




 // CREATE CHARTS METHODS
 private createChartProductos(){
  this.chartProductos = new Chart("MyChartProductos",{
    type: 'bar',
    data: {
      labels: this.listLabelProductosMes,
      datasets: [
        {
          label: '',
          data: this.listLabelProductosMesValue,
          backgroundColor: [
            "#DEB887",
            "#A9A9A9",
            "#DC143C",
            "#F4A460",
            "#2E8B57",
            "#DEB887",
            "#A9A9A9",
            "#DC143C",
            "#F4A460",
            "#2E8B57"
          ],
        },
       ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1.2,
      plugins: {
        title: {
            display: true,
            text: 'Productos Del Mes'
        }
      },
      scales: {
        yAxes: {
          ticks: {
              display: false
          }
      }
      },
    }
  });
 }


 private createChartClientes(){
  this.chartProductos = new Chart("MyChartClientes",{
    type: 'bar',
    data: {
      labels: this.listLabelClientesMes,
      datasets: [
        {
          label: '',
          data: ['467','467','467','467','467','467','467','467','467','467'],
          backgroundColor: [
            "#DEB887",
            "#A9A9A9",
            "#DC143C",
            "#F4A460",
            "#2E8B57",
            "#DEB887",
            "#A9A9A9",
            "#DC143C",
            "#F4A460",
            "#2E8B57"
          ],
        },
       ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1.2,
      plugins: {
        title: {
            display: true,
            text: 'Clientes Del Mes'
        }
      },
      scales: {
        yAxes: {
          ticks: {
              display: false
          }
      }
      },
    }
  });
 }

 private createChartFormaPago(){
  this.chartFormasPago = new Chart("MyChartVentasFormaPago",{
    type: 'doughnut',
    data: {
      labels: ['Efectivo','Cheque','Transferencia','Voucher','Deposito'],
      datasets: [
        {
          label: '',
          data: [20,50,20,10,20],
          backgroundColor: [
            "#DEB887",
            "#A9A9A9",
            "#DC143C",
            "#F4A460",
            "#2E8B57"
          ],
        },
       ]
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        title: {
            display: true,
            text: 'Ventas Del Dia'
        },
        legend: {
          position: 'right'
       }
      },
     
    }
  });
 }
}
