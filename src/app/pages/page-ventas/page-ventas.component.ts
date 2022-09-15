import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatChip } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { BuscarClienteDialogComponent } from 'src/app/components/buscar-cliente-dialog/buscar-cliente-dialog.component';
import { BuscarProductoDialogComponent } from 'src/app/components/buscar-producto-dialog/buscar-producto-dialog.component';
import { CrearClienteDialogComponent } from 'src/app/components/crear-cliente-dialog/crear-cliente-dialog.component';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ProductFactura } from 'src/app/interfaces/ProductFactura';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';
import { ClienteFactura } from './models/ClientFac';

@Component({
  selector: 'app-page-ventas',
  templateUrl: './page-ventas.component.html',
  styleUrls: ['./page-ventas.component.css']
})
export class PageVentasComponent implements OnInit{

  displayedColumns: string[] = ['#', 'Codigo', 'Articulo', 'Cantidad', 'P Unitario','descuento', 'P Total', 'actions'];
  datasource = new MatTableDataSource<ProductFactura>();

  @ViewChild('identificacion') inputIdentificacion: any; 
  @ViewChild('nombreCliente') inputNombreCliente: any; 
  @ViewChild('dirCliente') inputDirCliente: any;
  @ViewChild('telCliente') inputTelCliente: any;
  @ViewChild('generalContainer') containerGeneral!: ElementRef;
  @ViewChild('secuencial') secuencial!: ElementRef;

  idEmpresa: number = 0;
  rucEmpresa: string = '';
  idUser: number = 0;
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;
  
  value001:string = "001";
  value002:string = "001";
  valueSecuencia:string = "1";
  loadingSecuencial = true;
  observacion = "";

  total: string = "00.0";
  subtotal: string = "00.0";
  subtotalIva0: string = "00.0";
  subtotalIva12: string = "00.0";
  Iva12: string = "00.0";

  clientFac: ClienteFactura = new ClienteFactura(0, '999999999', 'CONSUMIDOR FINAL', '','','0999999999');

  listFormaPago = ['Efectivo', 'Cheque', 'Transferencia', 'Voucher', 'Credito'];
  listTipoDocumento = ['Factura', 'Nota de Venta', 'Otros'];

  tipoDocSelect = 'Factura';
  formaPagoSelect = 'Efectivo';
  dateFac = new Date();

  cantItems = 0

  constructor(private matDialog: MatDialog,
    public viewContainerRef: ViewContainerRef,
    private toastr: ToastrService,
    private coreService: ApplicationProvider,
    private loadingService: LoadingService) {

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

    //REQUEST DATA CONFIG SECUENCIAL
    setTimeout(() => {
      this.loadingSecuencial = !this.loadingSecuencial
    }, 3000);
  }


  removeCart(indexItem: number){
    
    const data = this.datasource.data;
    data.splice(indexItem, 1);
    this.datasource.data = data;

    this.cantItems = this.datasource.data.length;
    // CALCULATE TOTAL VALUE IN ITEMS LIST
    this.calculateTotalItems();
  }

  nuevoClienteClick(){

    const dialogRef = this.matDialog.open(CrearClienteDialogComponent, {
      width: '100%',
      closeOnNavigation: true, 
      viewContainerRef: this.viewContainerRef
    });

  dialogRef.afterClosed().subscribe(result => {
    if(result){
      
      this.clientFac.id = result.data['id'];
      this.clientFac.ciRuc = result.data['ciRuc'];
      this.clientFac.nombre = result.data['nombre'];
      this.clientFac.direccion = result.data['direccion'];
      this.clientFac.email = result.data['email'];
    }
  });
  }

  buscarClienteClick(){
    const dialogRef = this.matDialog.open(BuscarClienteDialogComponent, {
      width: '100%',
      closeOnNavigation: true,
      viewContainerRef: this.viewContainerRef
    });

  dialogRef.afterClosed().subscribe(result => {
    if(result){

      this.clientFac.id = result['cli_id'];
      this.clientFac.ciRuc = result['cli_documento_identidad'];
      this.clientFac.nombre = result['cli_nombres_natural'];
      this.clientFac.direccion = result['cli_direccion'];
      this.clientFac.email = result['cli_email'];

    }
  });
  }

  agregarProductoClick(){
    const dialogRef = this.matDialog.open(BuscarProductoDialogComponent, {
      width: '100%',
      closeOnNavigation: true,
      viewContainerRef: this.viewContainerRef
    });

  dialogRef.afterClosed().subscribe(result => {
    if(result){

      const data = this.datasource.data;
      const productItemAdd = {
        id: result.prod_id,
        codigo: result.prod_codigo,
        nombre: result.prod_nombre,
        precio: result.prod_pvp,
        cantidad: 1,
        descuento: 0,
        iva: result.prod_iva_si_no
      }

      data.push(productItemAdd);
      this.datasource.data = data;

      this.cantItems = this.datasource.data.length;
      // CALCULATE TOTAL VALUE IN ITEMS LIST
      this.calculateTotalItems();
    }
  });
  }

  private calculateTotalItems(){
    let valorTotal = 0.0;
    let subtotal = 0.0;
    let subtotalIva0 = 0.0;
    let subtotalIva12 = 0.0;
    let iva12 = 0.0;
    let result = 0.0

    this.datasource.data.forEach((item: ProductFactura, index: number) => {

        if(item.iva == "1"){
          result = ((item.cantidad * item.precio) / 1.12);
        }else{
          result = (item.cantidad * item.precio);
        }
        const totalConDescuento = (result - ((result * item.descuento) / 100));

        if(item.iva == "1"){
          subtotalIva12 += totalConDescuento;
        }else{
          subtotalIva0 += totalConDescuento;
        }
        subtotal += totalConDescuento;
    });
    
    iva12 = ((subtotalIva12 * 12) / 100);
    this.Iva12 = iva12.toFixed(2).toString();
    this.subtotal = subtotal.toFixed(2).toString();
    this.subtotalIva0 = subtotalIva0.toFixed(2).toString();
    this.subtotalIva12 = subtotalIva12.toFixed(2).toString();


    valorTotal = subtotal + iva12
    this.total = (Math.round(valorTotal * 100) / 100).toFixed(2).toString();

  }

  changeCantidadItemBlur(productItem: ProductFactura){
    if(!productItem.cantidad || productItem.cantidad < 0){
      productItem.cantidad = 1;
    }

    this.calculateTotalItems();
  }
  changeDescuentoItemBlur(productItem: ProductFactura){
    if(!productItem.descuento || productItem.descuento < 0){
      productItem.descuento = 0;
    }

    this.calculateTotalItems();
  }
  changePrecioUnitarioItemBlur(productItem: ProductFactura){
    if(!productItem.precio || productItem.precio <= 0){
      productItem.precio = 1;
    }

    this.calculateTotalItems();
  }

  selectChip(selectChip: any){
    const matChip = selectChip as MatChip;
    matChip.selected = true;
    console.log(matChip);
  }


  // GUARDAR DATOS FACTURA
  guardarFactura(){
    
    if(!this.validateClienteFac()){
      this.toastr.error('Verifique que los datos de Cliente sean correctos', '', {
        timeOut: 4000,
        closeButton: true
      });

      return;
    }

    if(!this.validateDatosFac()){
      this.toastr.error('Verifique que los datos de Factura sean correctos', '', {
        timeOut: 4000,
        closeButton: true
      });
      return;
    }

    if(!this.validateListProduct()){
      this.toastr.error('No se han agregado Productos', '', {
        timeOut: 4000,
        closeButton: true
      });
      return;
    }

    // CREAR OBJETOS Y GUARDAR
    // SEND JSON OBJECT QUE TENGA DATOS DE VENTA Y UN ARRAY CON VENTA DETALLE
    const detallesVenta: any = []
    this.datasource.data.forEach(data => {

      let precioTotal = 0.0
      let precioUnitario = 0.0;
      let totalSinIva = 0.0;

      if(data.iva == "1"){
        precioUnitario = (data.precio / 1.12);
      }else{
        precioUnitario = data.precio;
      }
      totalSinIva = precioUnitario * data.cantidad;
      precioTotal = (totalSinIva - ((totalSinIva * data.descuento) / 100));

      detallesVenta.push({
        prodId: data.id,
        cantidad: data.cantidad,
        iva: (data.iva == "1" ? "12.00" : "0.00"),
        nombreProd: data.nombre,
        valorUnitario: precioUnitario,
        descuento: data.descuento,
        valorTotal: precioTotal
      });

    });

    const actualDateHours = new Date();
    const dateString = '' + this.dateFac.getFullYear() + '-' + ('0' + (this.dateFac.getMonth()+1)).slice(-2) + 
                          '-' + ('0' + this.dateFac.getDate()).slice(-2) + ' ' + 
                          actualDateHours.getHours() + ':' + actualDateHours.getMinutes() + ':' + actualDateHours.getSeconds();
    
    const sendFacturaJsonModel = {
      empresaId: this.idEmpresa,
      tipoVenta: this.tipoDocSelect,
      venta001: this.value001,
      venta002: this.value002,
      ventaNumero: this.valueSecuencia,
      ventaFechaHora: dateString,
      usuId: this.idUser,
      clienteId: this.clientFac.id,
      subtotal12: this.subtotalIva12,
      subtotal0: this.subtotalIva0,
      valorIva: this.Iva12,
      ventaTotal: this.total,
      formaPago: this.formaPagoSelect,
      obs: this.observacion,
      ventaDetalles: detallesVenta
    }

    console.log(sendFacturaJsonModel);

    let overlayRef = this.loadingService.open();

    this.coreService.insertVentaFacturaToBD(sendFacturaJsonModel, this.tokenValidate).subscribe({
      next: (data: any) => {
        overlayRef.close();

        if(data['isDuplicate']){
          this.toastr.error('Ya esta en uso el Numero de Factura', '', {
            timeOut: 4000,
            closeButton: true
          });
          
          this.secuencial.nativeElement.focus();
          return;
        }

        this.toastr.success('Venta Guardada Correctamente', '', {
          timeOut: 4000,
          closeButton: true
        });

        this.resetControls();


      },
      error: (error) => {
        overlayRef.close();
        this.toastr.error('Ocurrio un error, reintente', '', {
          timeOut: 4000,
          closeButton: true
        });
      }

    });
  }
  
  private validateClienteFac(): boolean{
    return (this.clientFac && this.clientFac['id'] != 0);
  }

  private validateDatosFac(): boolean{
    return true;
  }

  private validateListProduct(): boolean{
    return this.datasource.data.length > 0
  }


changeNumFac(numeroFac: number){
  
  if(numeroFac == 1){
    if(!this.value001 ){
      this.value001 = "001";
      return;
    }
    
    this.value001 = (this.value001.length == 1) ? `00${this.value001}` :  this.value001
    this.value001 = (this.value001.length == 2) ? `0${this.value001}` :  this.value001
    
    return;
  }

  if(numeroFac == 2){
    if(!this.value002){
      this.value002 = "001";
    }
    
    this.value002 = (this.value002.length == 1) ? `00${this.value002}` :  this.value002
    this.value002 = (this.value002.length == 2) ? `0${this.value002}` :  this.value002

    return;
  }

  if(!this.valueSecuencia){
    this.valueSecuencia = "1";
    return;
  }
  
}

  private resetControls(){
      this.clientFac.id = 0;
      this.clientFac.ciRuc = '999999999';
      this.clientFac.nombre = 'CONSUMIDOR FINAL';
      this.clientFac.direccion = '';
      this.clientFac.email = '0999999999';

      this.tipoDocSelect = 'Factura';
      this.dateFac = new Date();
      this.formaPagoSelect = 'Efectivo';
      this.datasource.data = [];

      this.total = "00.0";
      this.subtotal = "00.0";
      this.subtotalIva0 = "00.0";
      this.subtotalIva12 = "00.0";
      this.Iva12 = "00.0";
  }
}
