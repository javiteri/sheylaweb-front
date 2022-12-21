import {Component, OnInit } from '@angular/core';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import {Chart, registerables} from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  
  listLabelProductosMes: any[] = [];
  listLabelProductosMesValue: any[] = [];

  listLabelClientesMes: any[] = [];

  chartProductos: any;
  chartClientes: any;
  chartRadialDiasLicencia: any;

  listLabelFormaPagoChart: any[] = [];
  listFormaPagoChartValue: any[] = [];
  chartFormasPago: any;

  idEmpresa: number = 0;
  rucEmpresa: string = '';
  nombreBd: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  ventaDiariaValue = "0.00";
  ventaMensualValue = "0.00";
  clientesRegistradosValue = "0";
  productosRegistradosValue = "0";
  documentosEmitidosValue = "0";
  diasLicenciaValue = "0";

  
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
    this.nombreBd = localServiceResponseUsr._nombreBd;

    this.getVentasDelDiaFormaPago();
    this.getVentaDiariaValue();
    this.getVentaMensualValue();
    this.getClientesRegistradosValue();
    this.getProductosRegistradosValue();
    this.getNumeroDocsAndLicenceDays();
    this.getClientesDelMes();
    this.getProductosDelMes();

  }


  private getVentaDiariaValue(): void {

    const firstDay = new Date();

    const dateInitString = '' + firstDay.getFullYear() + '-' + ('0' + (firstDay.getMonth()+1)).slice(-2) + 
                          '-' + ('0' + firstDay.getDate()).slice(-2) + ' ' + 
                            '00:00:00' ;
    const dateFinString = '' + firstDay.getFullYear() + '-' + ('0' + (firstDay.getMonth()+1)).slice(-2) + 
                            '-' + ('0' + firstDay.getDate()).slice(-2) + ' ' + 
                              '23:59:59' ;


     this.coreService.getValueVentaDiaria(this.idEmpresa,dateInitString,dateFinString,
                                            this.tokenValidate, this.nombreBd).subscribe({
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

    this.coreService.getValueVentaMensuual(this.idEmpresa,dateInitString,dateFinString,
                                            this.tokenValidate, this.nombreBd).subscribe({
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
  this.coreService.getInfoClientesRegistrados(this.idEmpresa,this.tokenValidate, this.nombreBd).subscribe({
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
  this.coreService.getInfoProductosRegistrados(this.idEmpresa,this.tokenValidate, this.nombreBd).subscribe({
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
  this.coreService.getNumDocAndLicenceDays(this.rucEmpresa,this.tokenValidate, this.nombreBd).subscribe({
    next: (data: any) =>{
      
      if(data.data && data.data[0].finfactura){
        const dateActual = new Date();
        const dateInit = new Date(data.data[0].finfactura);

        let time = dateInit.getTime() - dateActual.getTime(); 
        let days = time / (1000 * 3600 * 24); //Diference in Days

        this.diasLicenciaValue = Number(days).toFixed(0);

        this.createChartRadialDiasLicencia();
      }
      

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


  this.coreService.getProductosDelMes(this.idEmpresa,dateInitString,dateFinString,this.tokenValidate, this.nombreBd).subscribe({
    next: (data: any) =>{

      if(data.data && data.data.length > 0){
        const listLabel = Array.from(data.data).map((valor: any) => valor.ventad_producto.split(' '));
        const listValue = Array.from(data.data).map((valor: any) => valor.cantidad);

        this.listLabelProductosMes = listLabel;
        this.listLabelProductosMesValue = listValue;
      }else{
        this.listLabelProductosMes = ['Producto'];
        this.listLabelProductosMesValue = [400];
      }

      this.createChartProductos();
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


  this.coreService.getClientesDelMes(this.idEmpresa,dateInitString,dateFinString,this.tokenValidate, this.nombreBd).subscribe({
    next: (data: any) =>{
      if(data.data && data.data.length > 0){
        const listLabel = Array.from(data.data).map((valor: any) => valor.cli_nombres_natural.split(' '));
        this.listLabelClientesMes = listLabel;
        
      }else{
        this.listLabelClientesMes = ['Cliente'];
      }

      this.createChartClientes();

    },
    error: (error: any) => {
      console.log('error inside clientes del mes');
    }
  });
 }

 private getVentasDelDiaFormaPago(): void{

  const firstDay = new Date();

    const dateInitString = '' + firstDay.getFullYear() + '-' + ('0' + (firstDay.getMonth()+1)).slice(-2) + 
                          '-' + ('0' + firstDay.getDate()).slice(-2) + ' ' + 
                            '00:00:00' ;
    const dateFinString = '' + firstDay.getFullYear() + '-' + ('0' + (firstDay.getMonth()+1)).slice(-2) + 
                            '-' + ('0' + firstDay.getDate()).slice(-2) + ' ' + 
                              '23:59:59' ;


  this.coreService.getVentasDelDiaFormaPago(this.idEmpresa,dateInitString,dateFinString,this.tokenValidate,this.nombreBd).subscribe({
    next: (data: any) =>{

      if(data.data && data.data.length > 0){

        const listLabel = Array.from(data.data).map((valor: any) => valor.venta_forma_pago.split(' '));
        const listValue = Array.from(data.data).map((valor: any) => valor.total);

        this.listLabelFormaPagoChart = listLabel;
        this.listFormaPagoChartValue = listValue;

      }else{
        
        this.listLabelFormaPagoChart = ["Sin Ventas"];
        this.listFormaPagoChartValue = [1];
      }
      this.createChartFormaPago();
    },
    error: (error: any) => {
      console.log('error inside ventas dia forma pago');
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
        },
        xAxes: {
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
        },
        xAxes: {
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
      labels: [...this.listLabelFormaPagoChart],
      datasets: [
        {
         
          data: this.listFormaPagoChartValue,
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

 private createChartRadialDiasLicencia(){

  let diasLicenciaValor = this.diasLicenciaValue;
  let valoresChart: any[] = [];

  const doughtnText = {
    id: 'chart',
    beforeDraw(chart: any,args: any,options: any){
      const {ctx,chartArea:{width,height}} = chart;
      ctx.save();

      ctx.font = 'bolder 14px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText(diasLicenciaValor,width / 2, height / 2);
      ctx.fillText("dias licencia",width / 2, (height + 23) / 2);
      ctx.restore();
    }
  }

  if(Number(diasLicenciaValor) <= 365){
    const restValue = (365 - Number(diasLicenciaValor));
    valoresChart = [diasLicenciaValor,restValue];
  }else{
    valoresChart = [1,0]
  }

  this.chartFormasPago = new Chart("chart",{
    type: 'doughnut',
    data: {
      datasets: [
        {
          label: "Gauge",
          data: valoresChart,
          backgroundColor: [
            "green",
            "rgba(255,26,104,0)",
          ],
          borderColor: [
            'green',
            'rgba(100,26,104,0.1)'
          ]
        },
       ]
    },
    options: {
      cutout: '90%',
      plugins:{

        legend:{
          display:false
        },
        tooltip:{
          enabled: false
        }
      }
    },
    plugins: [doughtnText]
  });
 }
}
