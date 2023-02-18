import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatestWith } from 'rxjs';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ProductFactura } from 'src/app/interfaces/ProductFactura';
import { ApplicationProvider } from 'src/app/providers/provider';

@Component({
  selector: 'app-receipt-proforma',
  templateUrl: './receipt-proforma.component.html',
  styleUrls: ['./receipt-proforma.component.css']
})
export class ReceiptProformaComponent implements OnInit {

  textFacturaElectronicaFooter: string = '';
  idProforma: number = 0;

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

  textRouteBack = `/clientes/crearproforma`;
  
  configValorIva = "12.00";
  valorIvaDecimal = "1.12";

  constructor(route: ActivatedRoute,
    private router: Router,
    private coreService: ApplicationProvider,
    private ref: ChangeDetectorRef) { 

      this.idProforma = route.snapshot.params['id'];
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

    this.getDataFromidProforma(postDataGetEmp);
    
  }

  getDataFromidProforma(postDataGetEmp: any): void{

    this.coreService.getDataByIdProforma(this.idProforma, this.idEmpresa, this.rucEmpresa, this.tokenValidate, this.nombreBd).subscribe({
      next:(datosProforma: any) =>{

        this.coreService.empresaByRucAndId(postDataGetEmp, this.tokenValidate).subscribe({
          next:(dataEmp: any) =>{
            let empresaData = dataEmp.data[0];

            this.nombreEmpresa = empresaData['nombreEmp'];
            this.razonSocial = empresaData['razonSocial'];

            let ciRuc = datosProforma.data['cc_ruc_pasaporte'];
            let nombre = datosProforma.data['cliente'];
            let telefono = datosProforma.data['clienteTele'];
            let direccion = datosProforma.data['clienteDir'];
            let email = datosProforma.data['clienteEmail'];
            this.observacionValue = datosProforma.data['Observaciones'];

            if(this.observacionValue && this.observacionValue.length > 0){
              this.showObservaciones = true;
            }

            let formaPagoSelect = datosProforma.data['forma_pago'];
            const mDate = new Date(datosProforma.data['fechaHora']);
            let dateFac = mDate;

            this._textNumeroFactura = `# ${datosProforma.data['numero']} (${formaPagoSelect})`;
            this.textUsuario += datosProforma.data['usuario'];
            this.textFechaFactura = `${dateFac.getDate()}/${dateFac.getMonth() + 1}/${dateFac.getFullYear()} ${dateFac.getHours()}:${dateFac.getMinutes()}:${dateFac.getSeconds()}`;
            this.textCliente += `${nombre}`;
            this.textRucCi += `${ciRuc}`;
            this.textOnlyRucCi = `${ciRuc}`;
            this.textDireccion += `${direccion}`;

            let dataInSource = this.listaVentaDetalle;
            const arrayProformaDetalle = Array.from(datosProforma.data.data);
            try{
              this.textCanItems += 
                `(${arrayProformaDetalle.length} ${(arrayProformaDetalle.length > 1) ? 'ITEMS': 'ITEM'})`;
            }catch(exception){
            }

            let valorIva = arrayProformaDetalle.find((value: any) => {
              return Number(value['profd_iva']) == 8; 
            }) as any;
            if(valorIva){
              let valorIvaDecimal = (Number(valorIva['profd_iva']) / 100) + 1;
              this.configValorIva = valorIva['profd_iva'];
              this.valorIvaDecimal = valorIvaDecimal.toFixed(4);
              
            }

            let descuentoSumatoria = 0.00;
            arrayProformaDetalle.forEach((data: any) => {
              let cantidad = Number(data.profd_cantidad).toFixed(2);
              const productItemAdd: ProductFactura = {
                  id: data.profd_prod_id,
                  codigo: data.prod_codigo,
                  nombre: data.profd_producto,
                  precio: data.profd_vu,
                  cantidad: Number(cantidad),
                  descuento: data.profd_descuento,
                  iva: (data.profd_iva == "0.00") ? "0" : "1"
              }

              descuentoSumatoria += ((Number(productItemAdd['cantidad']) * Number(productItemAdd['precio'])) * Number(productItemAdd['descuento']) / 100);

              dataInSource.push(productItemAdd);
            });


            this.listaVentaDetalle = dataInSource;
            
            this.textDescuento = descuentoSumatoria.toFixed(2);
            this.textSubtotal = (Number(datosProforma.data['subtotal0']) + Number(datosProforma.data['subtotal12'])).toFixed(2).toString();
            this.textSubtotalIva0 = Number(datosProforma.data['subtotal0']).toFixed(2);
            this.textSubtotalIva12 = Number(datosProforma.data['subtotal12']).toFixed(2);
            this.textIva12 = datosProforma.data['valorIva'];
            this.textValorTotal = datosProforma.data['total'];

            this.ref.detectChanges();
          
            if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(window.navigator.userAgent)){
              this.isMobileDevice = true;
              window.onfocus = () => {
                this.router.navigateByUrl(this.textRouteBack);
                window.onfocus = () =>{}
              };
            }else{
              window.onbeforeprint = (event) => {
                this.router.navigateByUrl(this.textRouteBack);
                window.onbeforeprint = () =>{}
              };
            }

            window.print();
          }
        });

      },
      error: (error: any) => {}
    });

  }

  calcularIvaTemplate(){
    return parseInt(this.configValorIva);
  }

}
