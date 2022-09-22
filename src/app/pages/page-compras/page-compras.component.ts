import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { BuscarProductoDialogComponent } from 'src/app/components/buscar-producto-dialog/buscar-producto-dialog.component';
import { BuscarProveedorDialogComponent } from 'src/app/components/buscar-proveedor-dialog/buscar-proveedor-dialog.component';
import { CrearProveedorDialogComponent } from 'src/app/components/crear-proveedor-dialog/crear-proveedor-dialog.component';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ProductCompra } from 'src/app/interfaces/ProductCompra';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';
import { ProveedorFactura } from './models/ProveedorFac';

@Component({
  selector: 'app-page-compras',
  templateUrl: './page-compras.component.html',
  styleUrls: ['./page-compras.component.css']
})
export class PageComprasComponent implements OnInit {

  displayedColumns: string[] = ['#', 'Codigo', 'Articulo', 'Cantidad', 'costo','descuento', 'P Total', 'actions'];
  datasource = new MatTableDataSource<ProductCompra>();

  sendDatosFormCompra : FormGroup;

  numeroAutorizacion : String = "";
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
  
  listFormaPago = ['Efectivo', 'Cheque', 'Transferencia', 'Voucher', 'Credito'];
  listTipoDocumento = ['01 Factura','02 Nota de Venta','03 Liquidación de compra de Bienes o Prestación de servicios', 
    '04 Nota de crédito','05 Nota de débito','08 Boletos o entradas a espectáculos públicos','09 Tiquetes o vales emitidos por máquinas registradoras'
    ,'11 Pasajes expedidos por empresas de aviación','12 Documentos emitidos por instituciones financieras','15 Comprobante de Venta emitido en el exterior',
    '19 Comprobantes de Pago de Cuotas o Aportes','20 Documentos por Servicios Administrativos emitidos por Inst. del Estado',
    '21 Carta de Porte Aéreo','41 Comprobante de venta emitido por reembolso','47 N/C por Reembolso Emitida por Intermediario',
    '48 N/D por Reembolso Emitida por Intermediario','66 Nota de Crédito NO DEDUCIBLE','00 Documento NO DEDUCIBLE'];

  listSustentoTributario = ['00 - Casos especiales cuyo sustento no aplica en las opciones anteriores',
    '01 - Crédito Tributario para declaración de IVA (Servicios y bienes distintos de inventarios y activos fijos)',
    '02 - Costo o Gasto para declaración de Imp.  a la Renta (Servicios y bienes distintos de inventarios y activos fijos)',
    '03 - Activo Fijo - Crédito Tributario para declaración de IVA',
    '04 - Activo Fijo - Costo o Gasto para declaración de Imp. a la Renta',
    '05 - Liquidación de gastos de viaje, hospedaje y alimentación (a nombre de empleados y no de la empresa)',
    '06 - Inventario - Crédito Tributario para declaración de IVA',
    '07 - Inventario - Costo o Gasto para declaración de Imp. a la Renta',
    '08 - Valor pagado para solicitar Reembolso de Gastos (Intermediario)',
    '09 - Reembolso por Siniestros',
    '10 - Distribución de Dividendos, Beneficios o Utilidades',
    '11 - Convenio de débito o recaudación para IFI\'s',
    '12 - Impuestos y retenciones presuntivos',
    '13 - Valores reconocidos por entidades del sector público a favor de sujetos pasivos',
    '14 - Valores facturados por socios a operadoras de transporte (no constituyen fasto de la operadora)'];

  tipoDocSelect = '01 Factura';
  sustentoTributarioSelect = '00 - Casos especiales cuyo sustento no aplica en las opciones anteriores';
  formaPagoSelect = 'Efectivo';
  dateFac = new Date();
  cantItems = 0;

  proveedorFac: ProveedorFactura = new ProveedorFactura(0, '999999999', 'PROVEEDOR GENERICO', 'PROVEEDOR GENERICO','','0999999999');

  //@ViewChild('numeroAutorizacionEl') numeroAutorizacionEl = ElementRef<HTMLInputElement>;

  constructor(private matDialog: MatDialog,
    private toastr: ToastrService,
    private coreService: ApplicationProvider,
    private loadingService: LoadingService,
    private location: Location,
    private formBuilder: FormBuilder) {

      this.sendDatosFormCompra = this.formBuilder.group({
        numeroAutorizacionn: ['', [Validators.pattern(/^[0-9]*$/), Validators.minLength(9),Validators.required]]
      });
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

    setTimeout(() => {
      this.loadingSecuencial = false;
    }, 2000);

    this.getProveedorGenericoApi();
  }


  nuevoProveedorClick(){

    const dialogRef = this.matDialog.open(CrearProveedorDialogComponent, {
      width: '100%',
      closeOnNavigation: true
    });

  dialogRef.afterClosed().subscribe(result => {
    if(result){

      console.log(result);

      this.proveedorFac.id = result.data['id'];
      this.proveedorFac.ciRuc = result.data['ciRuc'];
      this.proveedorFac.nombre = result.data['nombre'];
      this.proveedorFac.direccion = result.data['direccion'];
      this.proveedorFac.email = result.data['email'];
      this.proveedorFac.telefono = result.data['telefono'];

    }
  });
  }

  buscarProveedorClick(){
    const dialogRef = this.matDialog.open(BuscarProveedorDialogComponent, {
      width: '100%',
      closeOnNavigation: true
    });

  dialogRef.afterClosed().subscribe(result => {
    if(result){
      this.proveedorFac.id = result['pro_id'];
      this.proveedorFac.ciRuc = result['pro_documento_identidad'];
      this.proveedorFac.nombre = result['pro_nombre_natural'];
      this.proveedorFac.direccion = result['pro_direccion'];
      this.proveedorFac.email = result['pro_email'];
      this.proveedorFac.telefono = result['pro_telefono'];
    }
  });
  }

  removeCart(indexItem: number){
    
    const data = this.datasource.data;
    data.splice(indexItem, 1);
    this.datasource.data = data;

    this.cantItems = this.datasource.data.length;
    // CALCULATE TOTAL VALUE IN ITEMS LIST
    this.calculateTotalItems();
  }

  agregarProductoClick(){
    const dialogRef = this.matDialog.open(BuscarProductoDialogComponent, {
      width: '100%',
      closeOnNavigation: true
    });

  dialogRef.afterClosed().subscribe(result => {
    if(result){

      const data = this.datasource.data;
      const productItemAdd = {
        id: result.prod_id,
        codigo: result.prod_codigo,
        nombre: result.prod_nombre,
        costo: result.prod_costo,
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

    this.datasource.data.forEach((item: ProductCompra, index: number) => {

        if(item.iva == "1"){
          result = ((item.cantidad * item.costo) / 1.12);
        }else{
          result = (item.cantidad * item.costo);
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

  changeCantidadItemBlur(productItem: ProductCompra){
    if(!productItem.cantidad || productItem.cantidad < 0){
      productItem.cantidad = 1;
    }

    this.calculateTotalItems();
  }
  changeDescuentoItemBlur(productItem: ProductCompra){
    if(!productItem.descuento || productItem.descuento < 0){
      productItem.descuento = 0;
    }

    this.calculateTotalItems();
  }
  changePrecioUnitarioItemBlur(productItem: ProductCompra){
    if(!productItem.costo || productItem.costo <= 0){
      productItem.costo = 1;
    }

    this.calculateTotalItems();
  }


  cancelarClick(): void{
    this.location.back();    
  }

  // GUARDAR DATOS DE LA COMPRA
  // GUARDAR DATOS FACTURA
  guardarCompra(){
    
    if(!this.validateProveedorFac()){
      this.toastr.error('Verifique que los datos de Proveedor sean correctos', '', {
        timeOut: 4000,
        closeButton: true
      });

      return;
    }

    if(!this.validateDatosFac()){
      this.toastr.error('Verifique que el Numero de Autorizacion sea correcto', '', {
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
    const detallesCompra: any = []
    this.datasource.data.forEach(data => {

      let precioTotal = 0.0
      let precioUnitario = 0.0;
      let totalSinIva = 0.0;

      if(data.iva == "1"){
        precioUnitario = (data.costo / 1.12);
      }else{
        precioUnitario = data.costo;
      }
      totalSinIva = precioUnitario * data.cantidad;
      precioTotal = (totalSinIva - ((totalSinIva * data.descuento) / 100));

      detallesCompra.push({
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
  

    const sendCompraJsonModel = {
      empresaId: this.idEmpresa,
      tipoCompra: this.tipoDocSelect,
      compraNumero: `${this.value001}-${this.value002}-${this.valueSecuencia}` ,
      compraFechaHora: dateString,
      usuId: this.idUser,
      proveedorId: this.proveedorFac.id,
      subtotal12: this.subtotalIva12,
      subtotal0: this.subtotalIva0,
      valorIva: this.Iva12,
      compraTotal: this.total,
      formaPago: this.formaPagoSelect,
      obs: this.observacion,
      sriSustento: this.sustentoTributarioSelect,
      compraAutorizacionSri: this.sendDatosFormCompra.controls['numeroAutorizacionn'].value,
      compraDetalles: detallesCompra,
      compraNcId: 0
    }

    console.log(sendCompraJsonModel);

    let overlayRef = this.loadingService.open();

    this.coreService.insertCompraFacturaToBD(sendCompraJsonModel, this.tokenValidate).subscribe({
      next: (data: any) => {
        overlayRef.close();

        console.log(data);
        if(data['isDuplicate']){
          this.toastr.error('Ya esta en uso el Numero de Compra', '', {
            timeOut: 4000,
            closeButton: true
          });
          
          return;
        }

        this.toastr.success('Compra Guardada Correctamente', '', {
          timeOut: 4000,
          closeButton: true
        });

        this.resetControls();

      },
      error: (error) => {
        overlayRef.close();
        console.log(error);
        this.toastr.error('Ocurrio un error, reintente', '', {
          timeOut: 4000,
          closeButton: true
        });
      }

    });
  }

  private validateProveedorFac(): boolean{
    return (this.proveedorFac && this.proveedorFac['id'] != 0);
  }

  private validateDatosFac(): boolean{    
    if(this.sendDatosFormCompra.invalid){
      return false;
    }
    return true;
  }

  private validateListProduct(): boolean{
    return this.datasource.data.length > 0
  }

  private getProveedorGenericoApi(){
    this.coreService.getProveedorGenericoOrCreate(this.idEmpresa, this.tokenValidate).subscribe({
      next: (response: any) => {

        const datosConsuFinal = response['data'];
        console.log(datosConsuFinal);

        this.proveedorFac.id = datosConsuFinal['pro_id'];
        this.proveedorFac.ciRuc = datosConsuFinal['pro_documento_identidad'];
        this.proveedorFac.nombre = datosConsuFinal['pro_nombre_natural'];
        this.proveedorFac.telefono = datosConsuFinal['pro_telefono'];
        this.proveedorFac.direccion =  '';
        this.proveedorFac.email = '';

        this.getNextNumeroSecuencial();
      },
      error: (error) => {
          console.log(error);
      }
    });
  }

  private getNextNumeroSecuencial(){

    this.loadingSecuencial = !this.loadingSecuencial

    this.coreService.getNextNumeroSecuencialCompraByIdEmp(this.idEmpresa, this.tipoDocSelect, 
                        this.proveedorFac.id,`${this.value001}-${this.value002}`,this.tokenValidate).subscribe({
      next: (response: any) => {
        this.loadingSecuencial = false;
        this.valueSecuencia = response.data;
        console.log('inside');
        console.log(response);
      },
      error: (error) => {
        this.loadingSecuencial = false;
        console.log(error);
      }
    });
  }

  changeTipoDoc(){
    this.getNextNumeroSecuencial();
  }

  private resetControls(){

    this.tipoDocSelect = '01 Factura';
    this.dateFac = new Date();
    this.formaPagoSelect = 'Efectivo';
    this.datasource.data = [];

    this.total = "00.0";
    this.subtotal = "00.0";
    this.subtotalIva0 = "00.0";
    this.subtotalIva12 = "00.0";
    this.Iva12 = "00.0";
    this.cantItems = 0;
    this.observacion = '';  
    this.sendDatosFormCompra.controls['numeroAutorizacionn'].setValue('');

    this.getProveedorGenericoApi();
    //this.getNextNumeroSecuencial();
}

  changeNumFac(numeroFac: number){
    
    const regexOnlyNumber = new RegExp(/^\d+$/);

    if(numeroFac == 1){
      if(!this.value001 ){
        this.value001 = "001";
        return;
      }

      if(!regexOnlyNumber.test(this.value001)){
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
      
      if(!regexOnlyNumber.test(this.value002)){
        this.value002 = "001";
        return;
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

}
