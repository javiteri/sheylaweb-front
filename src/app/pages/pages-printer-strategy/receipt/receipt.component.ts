import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatestWith, delay } from 'rxjs';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ProductFactura } from 'src/app/interfaces/ProductFactura';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements OnInit {

  textFacturaElectronicaFooter: string = '';
  idVenta: number = 0;

  idEmpresa: number = 0;
  rucEmpresa: string = '';
  idUser: number = 0;
  nombreBd: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;
  
  NAMES_CONFIGS_VENTAS = [
    "FAC_ELECTRONICA_AGENTE_RETENCION",
    "FAC_ELECTRONICA_CONTRIBUYENTE_ESPECIAL",
    "FAC_ELECTRONICA_PERTENECE_REGIMEN_RIMPE",
    "FAC_ELECTRONICA_OBLIGADO_LLEVAR_CONTABILIDAD"
  ];

  valueAgenteRetencion = '';
  valueContribuyenteEspecial = '';
  checkedAgenteDeRetencion = false;
  checkedContribuyenteEspecial = false;
  checkedPerteneceRegimenRimpe = false;
  checkedObligadoLlevarContabilidad = false;

  // Properties for Dynamic Template
  _textNumeroFactura = '';
  textFechaFactura = '';
  textUsuario = 'Usuario: ';
  textCliente = 'Cliente: ';
  textRucCi = 'RUC/CI: ';
  textOnlyRucCi = '';
  textDireccion = 'Direccion: ';

  listaVentaDetalle: ProductFactura[] = [];

  textSubtotal = '0.00';
  textSubtotalIva0 = '0.00';
  textSubtotalIva12 = '0.00';
  textDescuento = '0.00';
  textIva12 = '0.00';
  textValorTotal = '0.00';
  textCanItems = `Detalle `;

  textNumeroAutorizacion = `CA/AUTORIZACION: `;
  textTipoDocumento = '';
  showFooterFacElectronica = true;

  isMobileDevice = false;

  nombreEmpresa = '';
  razonSocial = '';
  showObservaciones = false;
  observacionValue :string = '';

  configValorIva = "12.00";
  valorIvaDecimal = "1.12";

  textRouteBack = `/ventas/crearventa`;
  private isReimpresion = "false";
  private showLogoPrint = "false"

  imgURL: any;

  constructor(route: ActivatedRoute,
    private router: Router,
    private coreService: ApplicationProvider,
    private ref: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private loadingService: LoadingService) {

    this.idVenta = route.snapshot.params['id'];
    this.isReimpresion = route.snapshot.params['reimpresion'];
    this.showLogoPrint = route.snapshot.params['isLogo']

    if(this.isReimpresion == 'true'){
      this.textRouteBack = '/ventas/listaventas';
    }
    this.textFacturaElectronicaFooter += "www.misfacturas.efacturas.net";
   
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
    this.idUser = localServiceResponseUsr._userId;
    this.nombreBd = localServiceResponseUsr._nombreBd;

    let postDataGetEmp = {
      ruc: this.rucEmpresa,
      idEmpresa: this.idEmpresa,
      nombreBd: this.nombreBd
    } 

    //this.getConfigValorIvaIdEmp();
    //this.getImagenLogo();
    this.getDataFromIdVenta(postDataGetEmp);
  }

  getDataFromIdVenta(postDataGetEmp: any): void{

    let $observableDatosVenta = this.coreService.getDataByIdVenta(this.idVenta, this.idEmpresa, this.rucEmpresa, this.tokenValidate, this.nombreBd);
    let $observableDatosConfigFacElec = this.coreService.getListConfigsByIdEmp(this.idEmpresa, this.tokenValidate, this.nombreBd);

    let overlayRef = this.loadingService.open();

    $observableDatosVenta.pipe(
      combineLatestWith($observableDatosConfigFacElec)
    ).subscribe(([result1, result2]: any) => {

      this.coreService.empresaByRucAndId(postDataGetEmp, this.tokenValidate).subscribe({
          next:(dataEmp: any) =>{

            this.coreService.getEstablecimientoByIdEmpNumeroEst(this.idEmpresa, result1.data['venta001'], this.nombreBd, this.tokenValidate).subscribe({
              next: (respEstablecimiento: any) =>{
                
                this.coreService.getImagenLogoByRucEmp(this.rucEmpresa, this.tokenValidate).subscribe({
                  next: (data: any) => {

                    overlayRef.close();

                    let objectURL = URL.createObjectURL(data);
                    this.imgURL = this.sanitizer.bypassSecurityTrustUrl(objectURL);

                    //---------------------SET DATA ---------------------------------------------------------------------
                    let datosEstablecimiento = respEstablecimiento.data;
                    let empresaData = dataEmp.data[0];

                    if(datosEstablecimiento != undefined && datosEstablecimiento != null && datosEstablecimiento[0]){
                      this.nombreEmpresa = datosEstablecimiento[0].nombreEmpresa;
                    }else{
                      this.nombreEmpresa = empresaData['nombreEmp'];
                    }
                    this.razonSocial = empresaData['razonSocial'];

                    let configObligadoContabilidad = result2.data.find((element: any) => element.con_nombre_config == 'FAC_ELECTRONICA_OBLIGADO_LLEVAR_CONTABILIDAD');
                    let configPerteneceRegimenRimpe = result2.data.find((element: any) => element.con_nombre_config == 'FAC_ELECTRONICA_PERTENECE_REGIMEN_RIMPE');
                    let configContribuyenteEspecial = result2.data.find((element: any) => element.con_nombre_config == 'FAC_ELECTRONICA_CONTRIBUYENTE_ESPECIAL');
                    let configAgenteRetencion = result2.data.find((element: any) => element.con_nombre_config == 'FAC_ELECTRONICA_AGENTE_RETENCION');

                    if(configObligadoContabilidad){
                      this.checkedObligadoLlevarContabilidad = configObligadoContabilidad.con_valor == 1;
                    }else{
                      this.checkedObligadoLlevarContabilidad = false;
                    }

                    if(configPerteneceRegimenRimpe){
                      this.checkedPerteneceRegimenRimpe = configPerteneceRegimenRimpe.con_valor == 1;
                    }
                    if(configAgenteRetencion && configAgenteRetencion.con_valor != '' && configAgenteRetencion.con_valor.trim().toUpperCase() != 'NO'){
                      this.checkedAgenteDeRetencion = true;
                      this.valueAgenteRetencion = configAgenteRetencion.con_valor;
                    }
                    if(configContribuyenteEspecial && configContribuyenteEspecial.con_valor != '' && configContribuyenteEspecial.con_valor.trim().toUpperCase() != 'NO'){
                      this.checkedContribuyenteEspecial = true;
                      this.valueContribuyenteEspecial = configContribuyenteEspecial.con_valor;
                    }

                    let ciRuc = result1.data['cc_ruc_pasaporte'];
                    let nombre = result1.data['cliente'];
                    let telefono = result1.data['clienteTele'];
                    let direccion = result1.data['clienteDir'];
                    let email = result1.data['clienteEmail'];
                    this.observacionValue = result1.data['Observaciones'];

                    if(this.observacionValue && this.observacionValue.length > 0){
                      this.showObservaciones = true;
                    }

                    let formaPagoSelect = result1.data['forma_pago'];
                    const mDate = new Date(result1.data['fechaHora']);
                    let dateFac = mDate;

                    let value001 = result1.data['venta001'];
                    let value002 = result1.data['venta002'];
                    let valueSecuencia = result1.data['numero'].padStart(9,'0');

                    this._textNumeroFactura = `${value001}-${value002}-${valueSecuencia} (${formaPagoSelect})`;
                    this.textUsuario += result1.data['usuario'];
                    this.textFechaFactura = `${dateFac.getDate()}/${dateFac.getMonth() + 1}/${dateFac.getFullYear()} ${dateFac.getHours()}:${dateFac.getMinutes()}:${dateFac.getSeconds()}`;
                    this.textCliente += `${nombre}`;
                    this.textRucCi += `${ciRuc}`;
                    this.textOnlyRucCi = `${ciRuc}`;
                    this.textDireccion += `${direccion}`;

                    let dataInSource = this.listaVentaDetalle;
                    const arrayVentaDetalle = Array.from(result1.data.data);

                    let valorIva = arrayVentaDetalle.find((value: any) => {
                      return Number(value['ventad_iva']) == 8; 
                    }) as any;
                    if(valorIva){
                      let valorIvaDecimal = (Number(valorIva['ventad_iva']) / 100) + 1;
                      this.configValorIva = valorIva['ventad_iva'];
                      this.valorIvaDecimal = valorIvaDecimal.toFixed(4);     
                    }

                    try{
                      this.textCanItems += 
                        `(${arrayVentaDetalle.length} ${(arrayVentaDetalle.length > 1) ? 'ITEMS': 'ITEM'})`;
                    }catch(exception){}

                    let descuentoSumatoria = 0.00;
                    arrayVentaDetalle.forEach((data: any) => {
                      let cantidad = Number(data.ventad_cantidad).toFixed(2);
                      
                      let productItemAdd: ProductFactura = {
                          id: data.ventad_prod_id,
                          codigo: data.prod_codigo,
                          nombre: data.ventad_producto,
                          precio: data.ventad_vu,
                          cantidad: Number(cantidad),
                          descuento: data.ventad_descuento,
                          iva: (data.ventad_iva == "0.00") ? "0" : "1"
                      }

                      descuentoSumatoria += ((Number(productItemAdd['cantidad']) * Number(productItemAdd['precio'])) * Number(productItemAdd['descuento']) / 100);

                      dataInSource.push(productItemAdd);
                    });

                    this.listaVentaDetalle = dataInSource;

                    this.textDescuento = descuentoSumatoria.toFixed(2);
                    this.textSubtotal = (Number(result1.data['subtotal0']) + Number(result1.data['subtotal12'])).toFixed(2).toString();
                    this.textSubtotalIva0 = Number(result1.data['subtotal0']).toFixed(2);
                    this.textSubtotalIva12 = Number(result1.data['subtotal12']).toFixed(2);
                    this.textIva12 = Number(result1.data['valorIva']).toFixed(2);
                    this.textValorTotal = Number(result1.data['total']).toFixed(2);

                    if(result1.data['documento'].toUpperCase() == 'FACTURA'){
                      this.textTipoDocumento = 'FACTURA ELECTRONICA';
                      this.textNumeroAutorizacion += result1.data['numeroautorizacion'];
                    }else{
                      this.textTipoDocumento = result1.data['documento'];
                      this.textNumeroAutorizacion = '';
                      this.showFooterFacElectronica = false;
                    }

                    this.ref.detectChanges();
                    
                      if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(window.navigator.userAgent)){
                        this.isMobileDevice = true;
      
                        window.onfocus = () => {
                          this.router.navigateByUrl(this.textRouteBack);
                          window.onfocus = () =>{}
                        }
                      }else{
                        window.onbeforeprint = (event)=>{
                          this.router.navigateByUrl(this.textRouteBack);
                          window.onbeforeprint = () =>{}
                        }
                      }
      
                      window.print();


                  },
                  error: (error : any) => {
                    console.log('inside error logo');
                  }
                });

              },
              error: (err: any) =>{}
            });
          }
      });

    });

  }


  private getImagenLogo(){
    this.coreService.getImagenLogoByRucEmp(this.rucEmpresa, this.tokenValidate).subscribe({
      next: (data: any) => {
        let objectURL = URL.createObjectURL(data);
        this.imgURL = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      error: (error : any) => {
        console.log('inside error logo');
      }
    });
  }

  calcularIvaTemplate(){
    return parseInt(this.configValorIva);
  }
}
