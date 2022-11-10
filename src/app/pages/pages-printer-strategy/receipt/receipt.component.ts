import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatestWith } from 'rxjs';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ProductFactura } from 'src/app/interfaces/ProductFactura';
import { ApplicationProvider } from 'src/app/providers/provider';

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
  textIva12 = '0.00';
  textValorTotal = '0.00';
  textCanItems = `Detalle `;

  textNumeroAutorizacion = `CA/AUTORIZACION: `;
  textTipoDocumento = '';
  showFooterFacElectronica = true;


  constructor(route: ActivatedRoute,
    private router: Router,
    private coreService: ApplicationProvider,
    private ref: ChangeDetectorRef) { 

    this.idVenta = route.snapshot.params['id'];
    this.textFacturaElectronicaFooter += "www.misfacturas.efacturas.net";
   
  }

  ngOnInit(): void {
    console.log('inside receipt component');

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

    this.getDataFromIdVenta()
    
  }

  getDataFromIdVenta(): void{

    let $observableDatosVenta = this.coreService.getDataByIdVenta(this.idVenta, this.idEmpresa, this.rucEmpresa, this.tokenValidate);
    

    let $observableDatosConfigFacElec = this.coreService.getListConfigsByIdEmp(this.idEmpresa, this.tokenValidate);

    $observableDatosVenta.pipe(
      combineLatestWith($observableDatosConfigFacElec)
    ).subscribe(([result1, result2]: any) => {
      console.log('datos venta');
      console.log(result1);
      console.log('datos configs');
      console.log(result2);

      let ciRuc = result1.data['cc_ruc_pasaporte'];
      let nombre = result1.data['cliente'];
      let telefono = result1.data['clienteTele'];
      let direccion = result1.data['clienteDir'];
      let email = result1.data['clienteEmail'];

      let formaPagoSelect = result1.data['forma_pago'];
      const mDate = new Date(result1.data['fechaHora']);
      let dateFac = mDate;

      let value001 = result1.data['venta001'];
      let value002 = result1.data['venta002'];
      let valueSecuencia = result1.data['numero'].padStart(9,'0');

      this._textNumeroFactura = `${value001}-${value002}-${valueSecuencia} (${formaPagoSelect})`;
      this.textUsuario += result1.data['usuario'];
      this.textFechaFactura = `${dateFac.getDay()}/${dateFac.getMonth() + 1}/${dateFac.getFullYear()} ${dateFac.getHours()}:${dateFac.getMinutes()}:${dateFac.getSeconds()}`;
      this.textCliente += `${nombre}`;
      this.textRucCi += `${ciRuc}`;
      this.textOnlyRucCi = `${ciRuc}`;
      this.textDireccion += `${direccion}`;

      let dataInSource = this.listaVentaDetalle;
      const arrayVentaDetalle = Array.from(result1.data.data);
      try{
        this.textCanItems += 
          `(${arrayVentaDetalle.length} ${(arrayVentaDetalle.length > 1) ? 'ITEMS': 'ITEM'})`;
      }catch(exception){
      }

      arrayVentaDetalle.forEach((data: any) => {

        const productItemAdd: ProductFactura = {
                id: data.ventad_prod_id,
                codigo: data.prod_codigo,
                nombre: data.ventad_producto,
                precio: data.ventad_vu,
                cantidad: data.ventad_cantidad,
                descuento: data.ventad_descuento,
                iva: (data.ventad_iva == "0.00") ? "0" : "1"
        }

        dataInSource.push(productItemAdd);
      });

      this.listaVentaDetalle = dataInSource;
      this.textSubtotal = 
      (Number(result1.data['subtotal0']) + Number(result1.data['subtotal12'])).toString();
      this.textIva12 = result1.data['valorIva'];
      this.textValorTotal = result1.data['total'];

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
        //console.log('executed in mobile');
      }else{
        //console.log('executed in desktop');
        window.onafterprint = (event) => {
          //console.log('inside after print event');
          this.router.navigateByUrl('/ventas/crearventa');
          window.onafterprint = () =>{}
        };
      }

      window.onfocus = () => {
        //console.log('inside on focus');
        this.router.navigateByUrl('/ventas/crearventa');
        window.onfocus = () =>{}
      }

      window.print();

    });

  }

}
