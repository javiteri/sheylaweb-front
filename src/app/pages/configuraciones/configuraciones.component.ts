import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { combineLatestWith } from 'rxjs';
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
  "CAJA_PERMITIR_CAMBIAR_USUARIO",
  "VENTAS_IMPRESION_DOCUMENTOS"
  ]

  NAMES_CONFIGS_VENTAS = [
    "FAC_ELECTRONICA_AGENTE_RETENCION",
    "FAC_ELECTRONICA_CONTRIBUYENTE_ESPECIAL",
    "FAC_ELECTRONICA_PERTENECE_REGIMEN_RIMPE",
    "FAC_ELECTRONICA_OBLIGADO_LLEVAR_CONTABILIDAD"
  ];
  valueAgenteRetencion = '';
  valueContribuyenteEspecial = '';
  checkedPerteneceRegimenRimpe = false;
  checkedObligadoLlevarContabilidad = false;
  claveFirmaElectronica = '';
  firmaElectronicaFile!: File


  listDecimalesVenta = ["0.00","0.000","0.0000","0.00000","0.000000"]
  decimalesVentaSelect = "0.00";
  decimalesCompraSelect = "0.00";
  ivaSelect = "00.00"
  checkedIvaIncluidoVentas = false;
  checkedVentasSinSecuencia = false;

  impresionDocumentosValue = '1';

  checkedPermitirChangeFechaMovCaja = false;
  checkedPermitirCambiarUsuarioCuadreCaja = false;
  idEmpresa: number = 0;
  rucEmpresa: string = '';
  nombreBd: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  isUploadFirmaElectronica = false;
  textUploadFirmaElectronica = '';
  hide = true;
  
  constructor(private location: Location,
    private coreService: ApplicationProvider,
    private loadingService: LoadingService,
    private toastr: ToastrService) { }

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

    this.getListConfigInit();
    this.getListDatosConfigNameFirmaElectronicaAndClave();
  }

  private getListConfigInit(){

    const overlayRef = this.loadingService.open();

    this.coreService.getListConfigsByIdEmp(this.idEmpresa, this.tokenValidate, this.nombreBd).subscribe({
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

        const impresionDocumentosVentas = dataArray.find(configReceive => configReceive.con_nombre_config == this.NAMES_CONFIGS[7]);
        if(impresionDocumentosVentas){
          this.impresionDocumentosValue = impresionDocumentosVentas.con_valor;
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


        const agenteRetencion = dataArray.find(configReceive => configReceive.con_nombre_config == this.NAMES_CONFIGS_VENTAS[0]);
        if(agenteRetencion){
          this.valueAgenteRetencion = agenteRetencion.con_valor;
        }else{
          this.valueAgenteRetencion = '';
        }
        const contribuyenteEspecial = dataArray.find(configReceive => configReceive.con_nombre_config == this.NAMES_CONFIGS_VENTAS[1]);
        if(contribuyenteEspecial){
          this.valueContribuyenteEspecial = contribuyenteEspecial.con_valor;
        }else{
          this.valueContribuyenteEspecial = '';
        }
        const checkPerteneceRegimenRimpe = dataArray.find(configReceive => configReceive.con_nombre_config == this.NAMES_CONFIGS_VENTAS[2]);
        if(checkPerteneceRegimenRimpe){
          this.checkedPerteneceRegimenRimpe = (checkPerteneceRegimenRimpe.con_valor == "1" ? true : false);
        }else{
          this.checkedPerteneceRegimenRimpe = false;
        }
        const checkObligadoLlevarContabilidad = dataArray.find(configReceive => configReceive.con_nombre_config == this.NAMES_CONFIGS_VENTAS[3]);
        if(checkObligadoLlevarContabilidad){
          this.checkedObligadoLlevarContabilidad = (checkObligadoLlevarContabilidad.con_valor == "1" ? true : false);
        }else{
          this.checkedObligadoLlevarContabilidad = false;
        }

        
      },
      error: (error) =>{
        overlayRef.close();
        console.log(error);
        console.log('error obteniendo lista configs');
      }
    });
  }

  private getListDatosConfigNameFirmaElectronicaAndClave(){
    this.coreService.getListConfigsFirmaElectronicaByIdEmp(this.rucEmpresa, this.tokenValidate).subscribe({
      next: (datos: any) =>{
        console.log('todo ok datos firma electronica');
        console.log(datos);
        if(datos.data.EMPRESA_RUTA_FIRMA && datos.data.EMPRESA_RUTA_FIRMA.length > 5){
          this.isUploadFirmaElectronica = true;
          this.textUploadFirmaElectronica = datos.data.EMPRESA_RUTA_FIRMA;//`(Registrada)`;
          console.log('firma electronica registrada');
        }
        if(datos.data.EMPRESA_CLAVE_FIRMA && datos.data.EMPRESA_CLAVE_FIRMA.length > 5){
          this.claveFirmaElectronica = datos.data.EMPRESA_CLAVE_FIRMA;
        }
      },
      error:(error) =>{
        console.log('error inside datos firma electronica');
        console.log(error);
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

    arrayConfig.push({idEmpresa: this.idEmpresa, nombreConfig: 'FACTURA_VALORIVA', valorConfig: this.ivaSelect, nombreBd: this.nombreBd});
    arrayConfig.push({idEmpresa: this.idEmpresa, nombreConfig: 'VENTA_NUMERODECIMALES', valorConfig: this.decimalesVentaSelect,nombreBd: this.nombreBd});
    arrayConfig.push({idEmpresa: this.idEmpresa, nombreConfig: 'COMPRA_NUMERODECIMALES', valorConfig: this.decimalesCompraSelect,nombreBd: this.nombreBd});

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
    this.insertConfig(nombreConfig, value);
  }

  private insertConfig(nombreConfig: any, value: any): void{

    const postData = [{
      nombreConfig: nombreConfig,
      valorConfig: value,
      idEmpresa: this.idEmpresa,
      nombreBd: this.nombreBd
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


  guardarConfigsFacturacionElectronica(){
    //const dialogRef = this.loadingService.open();
    const postData = {
      claveFirma: this.claveFirmaElectronica,
      ruc: this.rucEmpresa
    }
    const dialogRef = this.loadingService.open();
    let $observable = this.coreService.insertFirmaElectronicaConfig(postData, this.firmaElectronicaFile, this.tokenValidate);
      

    const data = [[
      this.idEmpresa,this.NAMES_CONFIGS_VENTAS[0], this.valueAgenteRetencion
    ],[
      this.idEmpresa,this.NAMES_CONFIGS_VENTAS[1],this.valueContribuyenteEspecial
    ],[
      this.idEmpresa,this.NAMES_CONFIGS_VENTAS[2],this.checkedPerteneceRegimenRimpe
    ],[
      this.idEmpresa,this.NAMES_CONFIGS_VENTAS[3],this.checkedObligadoLlevarContabilidad
    ]]

    let $observable1 = this.coreService.insertListConfigsFacElecToBD(data, this.tokenValidate);

    $observable.pipe(
      combineLatestWith($observable1)
    )
    .subscribe(([result1,result2]) => {
      dialogRef.close();
      this.toastr.success('Datos Guardados', '', {
        timeOut: 3000,
        closeButton: true
      });
    })

  }



  onFileChange(file: any){
    console.log(file);
    if(file.length === 0){
      console.log('el archivo es valido');
      return;
    }

    let nameImg = file[0].name;
    const mimeType = file[0].type;

    if (mimeType.match(/x-pkcs12\/*/) == null) {
      //this.mensajeError = `Error tipo de archivo no valido ${mimeType}`;
      //this.limpiarImagen();
      this.toastr.error('Archivo no válido', '', {
        timeOut: 3000,
        closeButton: true
      });
      return;
    }

    this.firmaElectronicaFile = file[0];

  }
}
