import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';
import { Config } from './models/Config';
import { ConfigReceive } from './models/ConfigReceive';


@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.css']
})
export class ConfiguracionesComponent implements OnInit {

  NAMES_CONFIGS = ["FACTURA_VALORIVA",
  "VENTA_NUMERODECIMALES",
  "COMPRA_NUMERODECIMALES",
  "VENTAS_PERMITIR_INGRESAR_SIN_SECUENCIA",
  "VENTAS_IVA_INCLUIDO_FACTURA",
  "CAJA_PERMITIR_CAMBIAR_FECHA",
  "CAJA_PERMITIR_CAMBIAR_USUARIO"
  ]


  listDecimalesVenta = ["0.00","0.000","0.0000","0.00000","0.000000"]

  decimalesVentaSelect = "0.00";
  decimalesCompraSelect = "0.00";
  ivaSelect = "00.00"
  checkedIvaIncluidoVentas = false;
  checkedVentasSinSecuencia = false;

  checkedPermitirChangeFechaMovCaja = false;
  checkedPermitirCambiarUsuarioCuadreCaja = false;
  idEmpresa: number = 0;
  rucEmpresa: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;
  
  constructor(private location: Location,
    private coreService: ApplicationProvider,
    private loadingService: LoadingService) { }

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

    this.getListConfigInit();
  }

  private getListConfigInit(){

    const overlayRef = this.loadingService.open();

    this.coreService.getListConfigsByIdEmp(this.idEmpresa, this.tokenValidate).subscribe({
      next: (data: any) => {
        overlayRef.close();

        const dataArray = Array.from<ConfigReceive>(data.data);

        const ivaFromConfig = dataArray.find(configReceive => configReceive.con_nombre_config == this.NAMES_CONFIGS[0]);
        if(ivaFromConfig){
          this.ivaSelect = ivaFromConfig.con_valor;
        }else{
          this.ivaSelect = "12.00"
        }

        const decimalesVentaConfig = dataArray.find(configReceive => configReceive.con_nombre_config == this.NAMES_CONFIGS[1]);
        if(decimalesVentaConfig){ 
          this.decimalesVentaSelect = decimalesVentaConfig.con_valor;
        }else{
          this.decimalesVentaSelect = "0.00";
        }
        const decimalesCompraConfig = dataArray.find(configReceive => configReceive.con_nombre_config == this.NAMES_CONFIGS[2]);
        if(decimalesCompraConfig){ 
          this.decimalesCompraSelect = decimalesCompraConfig.con_valor;
        }else{
          this.decimalesCompraSelect = "0.00";
        }
        const ivaIncluidoVentasConfig = dataArray.find(configReceive => configReceive.con_nombre_config == this.NAMES_CONFIGS[4]);
        if(ivaIncluidoVentasConfig){
          this.checkedIvaIncluidoVentas = (ivaIncluidoVentasConfig.con_valor == "1" ? true : false);
        }else{
          this.checkedIvaIncluidoVentas = false;
        }
        const ingresarSinSecuenciaConfig = dataArray.find(configReceive => configReceive.con_nombre_config == this.NAMES_CONFIGS[3]);
        if(ingresarSinSecuenciaConfig){
          this.checkedVentasSinSecuencia = (ingresarSinSecuenciaConfig.con_valor == "1" ? true : false);
        }else{
          this.checkedVentasSinSecuencia = false
        }

        const cajaAllowCambiarFecha = dataArray.find(configReceive => configReceive.con_nombre_config == this.NAMES_CONFIGS[5]);
        if(cajaAllowCambiarFecha){
          this.checkedPermitirChangeFechaMovCaja = (cajaAllowCambiarFecha.con_valor == "1" ? true : false);
        }else{
          this.checkedPermitirChangeFechaMovCaja = false
        }

        const cajaAllowCambiarUsuarioCuadre = dataArray.find(configReceive => configReceive.con_nombre_config == this.NAMES_CONFIGS[6]);
        if(cajaAllowCambiarUsuarioCuadre){
          this.checkedPermitirCambiarUsuarioCuadreCaja = (cajaAllowCambiarUsuarioCuadre.con_valor == "1" ? true : false);
        }else{
          this.checkedPermitirCambiarUsuarioCuadreCaja = false
        }

      },
      error: (error) =>{
        overlayRef.close();
        console.log(error);
        console.log('error obteniendo lista configs');
      }
    });
  }

  changeValorIva(): void{
    const regexOnlyNumber = new RegExp(/^\d+(\.\d{1,2})?$/);
    
    if(!regexOnlyNumber.test(this.ivaSelect)){
      this.ivaSelect = "12.00";
      return;
    }
    this.insertConfig(this.NAMES_CONFIGS[0], this.ivaSelect);

  }


  cancelarClick(): void{
    this.location.back();    
  }

  saveDatosConfig(): void{

    const arrayConfig : Config[] = [];

    arrayConfig.push({idEmpresa: this.idEmpresa, nombreConfig: 'FACTURA_VALORIVA', valorConfig: this.ivaSelect});
    arrayConfig.push({idEmpresa: this.idEmpresa, nombreConfig: 'VENTA_NUMERODECIMALES', valorConfig: this.decimalesVentaSelect});
    arrayConfig.push({idEmpresa: this.idEmpresa, nombreConfig: 'COMPRA_NUMERODECIMALES', valorConfig: this.decimalesCompraSelect});

    this.coreService.insertListConfigsToBD(arrayConfig, this.tokenValidate).subscribe({
      next: (data: any) => {
        console.log('inside todo ok');
        console.log(data);
      },
      error: (error) => {
        console.log('inside error');
        console.log(error);
      }
    });

  }


  changeToogle(nombreConfig: any, value: any): void{
    console.log(nombreConfig);
    console.log(value);
    this.insertConfig(nombreConfig, value);
  }

  private insertConfig(nombreConfig: any, value: any): void{

    const postData = [{
      nombreConfig: nombreConfig,
      valorConfig: value,
      idEmpresa: this.idEmpresa
    }]

    const dialogRef = this.loadingService.open();

    this.coreService.insertListConfigsToBD(postData, this.tokenValidate).subscribe({
      next: (data: any) => {
        dialogRef.close();
        console.log('config insertada corectamente');
        console.log(data);
      },
      error: (error) => {
        dialogRef.close();
        console.log('error insertando config');
        console.log(error);
      }
    });
  }
}
