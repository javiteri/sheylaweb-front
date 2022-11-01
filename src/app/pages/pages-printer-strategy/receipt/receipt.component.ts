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

    let $observableDatosVenta = this.coreService.getDataByIdVenta(this.idVenta, this.idEmpresa, this.tokenValidate);


    /*this.coreService.getDataByIdVenta(this.idVenta, this.idEmpresa, this.tokenValidate).subscribe({
      next: (data: any) =>{

        console.log('inside response data Venta Id');
        console.log(data);

        const afterPrint = () => {
          window.setTimeout(() => {
            console.log('inside after printttttttttttttttttttttttttttttttttttttttttttttt');
            window.removeEventListener('afterprint', afterPrint);
            this.router.navigateByUrl('/ventas/crearventa');
        }, 1);
    
        };
      
        window.addEventListener('afterprint', afterPrint);
        window.print();


        /*this.clientFac.id = data.data['clienteId'];
        this.clientFac.ciRuc = data.data['cc_ruc_pasaporte'];
        this.clientFac.nombre = data.data['cliente'];
        this.clientFac.telefono = data.data['clienteTele'];
        this.clientFac.direccion = data.data['clienteDir'];
        this.clientFac.email = data.data['clienteEmail'];

        this.formaPagoSelect = data.data['forma_pago']
        const mDate = new Date(data.data['fechaHora']);
        this.dateFac = mDate;

        this.value001 = data.data['venta001'];
        this.value002 = data.data['venta002'];
        this.valueSecuencia = data.data['numero'];
        this.loadingSecuencial = false;

        let dataInSource = this.datasource.data;
        const arrayVentaDetalle = Array.from(data.data.data);
        arrayVentaDetalle.forEach((data: any) => {

          const productItemAdd: ProductFactura = {
            id: data.ventad_prod_id,
            codigo: data.prod_codigo,
            nombre: data.ventad_producto,
            precio: Number(Number(data.ventad_vu).toFixed(this.fixedNumDecimal)),
            cantidad: data.ventad_cantidad,
            descuento: data.ventad_descuento,
            iva: (data.ventad_iva == "0.00") ? "0" : "1"
          }

          if(this.configIvaIncluidoEnVenta){
            
            if(productItemAdd.iva == "1"){
              
              productItemAdd.precio = ((productItemAdd.precio * 1.12).toFixed(this.fixedNumDecimal) as any);
            }
          }              

          dataInSource.push(productItemAdd);
    
        });

        this.datasource.data = dataInSource;
        this.cantItems = this.datasource.data.length;
        
        this.subtotalIva12 = Number(data.data['subtotal12']).toFixed(this.fixedNumDecimal);
        this.subtotalIva0 = Number(data.data['subtotal0']).toFixed(this.fixedNumDecimal);
        this.Iva12 = Number(data.data['valorIva']).toFixed(this.fixedNumDecimal);
        this.subtotal = (Number(this.subtotalIva12) + Number(this.subtotalIva0)).toFixed(this.fixedNumDecimal);
        this.total = Number(data.data['total']).toFixed(2);
      },
      error: (error: any) =>{
        if(error.error['notExist']){
          /*this.loadingSecuencial = false;
          this.toastr.error('No existe Venta', '', {
            timeOut: 4000,
            closeButton: true
          });

          this.router.navigate(['/ventas/listaventas']);

        }
      }
    });*/


    /*this.coreService.getListConfigsByIdEmp(this.idEmpresa, this.tokenValidate).subscribe({
      next: (data: any) => {

        const dataArray = Array.from<ConfigReceive>(data.data);

        console.log('inside get list config');
        console.log(dataArray);


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
        //overlayRef.close();
        console.log(error);
        console.log('error obteniendo lista configs');
      }
    });*/

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

      console.log(this.textUsuario);
      console.log(this.textFechaFactura);
      console.log(this.textCliente);

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

      this.ref.detectChanges();
      console.log(this.listaVentaDetalle);
      


      const afterPrint = () => {
        window.setTimeout(() => {
          console.log('inside after printttttttttttttttttttttttttttttttttttttttttttttt');
          window.removeEventListener('afterprint', afterPrint);
          this.router.navigateByUrl('/ventas/crearventa');
      }, 1);
  
      };
    
      window.addEventListener('afterprint', afterPrint);
      window.print();

    });

  }

}
