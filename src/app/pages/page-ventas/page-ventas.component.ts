import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatChip } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BuscarClienteDialogComponent } from 'src/app/components/buscar-cliente-dialog/buscar-cliente-dialog.component';
import { BuscarProductoDialogComponent } from 'src/app/components/buscar-producto-dialog/buscar-producto-dialog.component';
import { ConfirmDeleteDialogComponent } from 'src/app/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { CrearClienteDialogComponent } from 'src/app/components/crear-cliente-dialog/crear-cliente-dialog.component';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ProductFactura } from 'src/app/interfaces/ProductFactura';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingOverlayRef, LoadingService } from 'src/app/services/Loading.service';
import { ConfigReceive } from '../configuraciones/models/ConfigReceive';
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

  listFormaPago = ['EFECTIVO', 'CHEQUE', 'TRANSFERENCIA', 'DEPOSITO','VOUCHER', 'CREDITO'];
  listTipoDocumento = ['Factura', 'Nota de Venta', 'Otros'];

  tipoDocSelect = 'Factura';
  formaPagoSelect = 'EFECTIVO';
  dateFac = new Date();

  cantItems = 0;
  fixedNumDecimal = 2;
  permitirVentaSecuenciaIncorrecta = false;
  configIvaIncluidoEnVenta = true;

  configImpresionDocumentos = "1";

  constructor(private matDialog: MatDialog,
    public viewContainerRef: ViewContainerRef,
    private toastr: ToastrService,
    private coreService: ApplicationProvider,
    private loadingService: LoadingService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    public ref: ChangeDetectorRef) {
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

    this.getConfigNumDecimalesIdEmp();
    this.getConfigVentaSinSecuencia();
    this.getConfigIvaIncluidoEnVenta();
    this.getConfigImpresionDocumentosVenta();
    
  }

  private getDataRoutedMap(){
    this.route.paramMap.subscribe((params: any) => {

      let idVenta = params.get('idventa');
      
      if(idVenta){
        this.coreService.getDataByIdVenta(idVenta, this.idEmpresa,this.rucEmpresa, this.tokenValidate).subscribe({
          next: (data: any) =>{

            this.clientFac.id = data.data['clienteId'];
            this.clientFac.ciRuc = data.data['cc_ruc_pasaporte'];
            this.clientFac.nombre = data.data['cliente'];
            this.clientFac.telefono = data.data['clienteTele'];
            this.clientFac.direccion = data.data['clienteDir'];
            this.clientFac.email = data.data['clienteEmail'];

            this.formaPagoSelect = data.data['forma_pago'];
            console.log(data.data['forma_pago'].toLowerCase());
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
              this.loadingSecuencial = false;
              this.toastr.error('No existe Venta', '', {
                timeOut: 4000,
                closeButton: true
              });

              this.router.navigate(['/ventas/listaventas']);

            }
          }
        });


      }else{

        this.getNextNumeroSecuencial();
        this.getConsumidorFinalApi();
      }

    });
  }

  private getConsumidorFinalApi(){
    this.coreService.getConsumidorFinalOrCreate(this.idEmpresa, this.tokenValidate).subscribe({
      next: (response: any) => {

        const datosConsuFinal = response['data'];

        this.clientFac.id = datosConsuFinal['cli_id'];
        this.clientFac.ciRuc = datosConsuFinal['cli_documento_identidad'];
        this.clientFac.nombre = datosConsuFinal['cli_nombres_natural'];
        this.clientFac.telefono = datosConsuFinal['cli_teleono'];
        this.clientFac.direccion =  '';
        this.clientFac.email = '';
      },
      error: (error) => {
          console.log(error);
      }
    });
  }

  private getNextNumeroSecuencial(){

    this.loadingSecuencial = true;

    this.coreService.getNextNumeroPuntoVentaByUsuario(this.idEmpresa, this.tipoDocSelect,
                                                      this.idUser, this.tokenValidate).subscribe({
        next:(response: any) => {

          this.valueSecuencia = response.secuencial;
          this.value001 = (response.valor001).toString().padStart(3,'0');
          this.value002 = (response.valor002).toString().padStart(3,'0');
          this.ref.detectChanges();

          this.loadingSecuencial = false;
        },
        error: (error: any) => {
          console.log('error obteniendo no punto de venta');
        }
    });

  }


  private getNextNumeroSecuencialtwo(){

    this.loadingSecuencial = true;

    this.coreService.getNextNumeroSecuencialByIdEmp(this.idEmpresa, this.tipoDocSelect, 
                        this.value001, this.value002,this.tokenValidate).subscribe({
      next: (response: any) => {
        this.loadingSecuencial = false;
        this.valueSecuencia = response.data;

        this.ref.detectChanges();
      },
      error: (error) => {
        this.loadingSecuencial = false;
        console.log(error);
        this.ref.detectChanges();
      }
    });
  }


  private getConfigNumDecimalesIdEmp(){
    this.coreService.getConfigByNameIdEmp(this.idEmpresa,'VENTA_NUMERODECIMALES', this.tokenValidate).subscribe({
      next: (data: any) => {
        if(data.data.length > 0) {
          const configReceive: ConfigReceive = data.data[0];

          const splitValue = configReceive.con_valor.split('.');
          this.fixedNumDecimal = splitValue[1].length
        }

      },
      error: (error) => {
        console.log('error get num decimales');
        console.log(error);
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

  nuevoClienteClick(data?: any){
    const dialogRef = this.matDialog.open(CrearClienteDialogComponent, {
      width: '100%',
      closeOnNavigation: true, 
      viewContainerRef: this.viewContainerRef,
      data: {identificacion: data}
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

      if(result.redirectNewClient){
        this.nuevoClienteClick(result.data);
        return;
      }

      this.clientFac.id = result['cli_id'];
      this.clientFac.ciRuc = result['cli_documento_identidad'];
      this.clientFac.nombre = result['cli_nombres_natural'];
      this.clientFac.direccion = result['cli_direccion'];
      this.clientFac.email = result['cli_email'];
      this.clientFac.telefono = `${result['cli_celular']}  ${result['cli_teleono'] ? '-' : ''} ${result['cli_teleono']}`; 
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
      const productItemAdd: ProductFactura = {
        id: result.prod_id,
        codigo: result.prod_codigo,
        nombre: result.prod_nombre,
        precio: result.prod_pvp,
        cantidad: 1,
        descuento: 0,
        iva: result.prod_iva_si_no
      }

      if(!this.configIvaIncluidoEnVenta){
        if(productItemAdd.iva == "1"){
          productItemAdd.precio = Number((productItemAdd.precio / 1.12).toFixed(this.fixedNumDecimal));
        }
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

      if(!this.configIvaIncluidoEnVenta){
        result = (item.cantidad * item.precio);
      }else{

        if(item.iva == "1"){
          result = ((item.cantidad * item.precio) / 1.12);
        }else{
          result = (item.cantidad * item.precio);
        }

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
    this.Iva12 = iva12.toFixed(this.fixedNumDecimal).toString();
    this.subtotal = subtotal.toFixed(this.fixedNumDecimal).toString();
    this.subtotalIva0 = subtotalIva0.toFixed(this.fixedNumDecimal).toString();
    this.subtotalIva12 = subtotalIva12.toFixed(this.fixedNumDecimal).toString();


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

    const regexOnlyNumber = new RegExp(/^\d+(\.\d{1,20})?$/);
    
    if(!regexOnlyNumber.test(productItem.precio.toString()) || (!productItem.precio || productItem.precio <= 0) ){
      const value = (1).toFixed(this.fixedNumDecimal);
      productItem.precio = (value as any);
      return;
    }

    let productoPrecio = productItem.precio;
    const value = Number(productoPrecio).toFixed(this.fixedNumDecimal);
    productItem.precio = (value as any);

    this.calculateTotalItems();
  }

  selectChip(selectChip: any){
    const matChip = selectChip as MatChip;
    matChip.selected = true;
  }

  // GUARDAR DATOS FACTURA
  guardarFactura(){

    if(this.clientFac.ciRuc == '9999999999' && Number(this.total) >= 50){
      this.toastr.error('No se puede guardar una venta mayor a $50 a Consumidor Final.');
      return;
    }

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
      let precioUnitario = data.precio;
      let totalSinIva = 0.0;

      if(this.configIvaIncluidoEnVenta){
        if(data.iva == "1"){
          precioUnitario = Number((data.precio / 1.12).toFixed(this.fixedNumDecimal));
        }
      }

      totalSinIva = Number((precioUnitario * data.cantidad).toFixed(this.fixedNumDecimal));
      precioTotal = Number((totalSinIva - ((totalSinIva * data.descuento) / 100)).toFixed(this.fixedNumDecimal));

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
    
    console.log(dateString);

    const sendFacturaJsonModel = {
      empresaId: this.idEmpresa,
      tipoVenta: this.tipoDocSelect.toUpperCase(),
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
      formaPago: this.formaPagoSelect.toUpperCase(),
      obs: this.observacion,
      ventaDetalles: detallesVenta
    }

    let overlayRef = this.loadingService.open();

    this.coreService.getNextNumeroSecuencialByIdEmp(this.idEmpresa, this.tipoDocSelect, 
      this.value001, this.value002,this.tokenValidate).subscribe({
      next: (response: any) => {

        const valorSecuencial = response.data;
        if(Number(this.valueSecuencia) > valorSecuencial){
          if(this.permitirVentaSecuenciaIncorrecta){
            overlayRef.close();

            const dialogRef = this.matDialog.open(ConfirmDeleteDialogComponent, {
              width: '250px',
              data: {
                title: 'Esta seguro que desea registrar ese secuencial?',
                textBtnPositive: 'Aceptar'
              }
            });
        
            dialogRef.afterClosed().subscribe(result => {
              if(result){
                let dialogRef = this.loadingService.open();
                this.insertVentaToBD(sendFacturaJsonModel, dialogRef);
              }
        
            });


          }else{
            overlayRef.close();
            this.toastr.error('No se permite ingresar secuencia Incorrecta', '', {
              timeOut: 4000,
              closeButton: true
            });
            this.getNextNumeroSecuencialtwo();
          }

        }else{

          this.insertVentaToBD(sendFacturaJsonModel, overlayRef);
        }        
      },
      error: (error) => {
        overlayRef.close();
        console.log(error);
      }
    });
    

  }


  private insertVentaToBD(sendFacturaJsonModel: any, overlayRef: LoadingOverlayRef){
    this.coreService.insertVentaFacturaToBD(sendFacturaJsonModel, this.tokenValidate).subscribe({
      next: (data: any) => {
        overlayRef.close();

        if(data['isDuplicate']){
          this.toastr.error('Ya esta en uso el Numero de Factura', '', {
            timeOut: 4000,
            closeButton: true
          });
          
          this.secuencial.nativeElement.focus();
          this.getNextNumeroSecuencial();
          return;
        }

        if(this.configImpresionDocumentos == '1'){
          this.toastr.success('Venta Guardada Correctamente', '', {
            timeOut: 4000,
            closeButton: true
          });

          this.verPdfVenta(data.ventaid,this.inputIdentificacion.nativeElement.value,this.tipoDocSelect);

        }else{

          this.router.navigate([
            { outlets: {
              'print': ['print','receipt',data.ventaid]
          }}]);


        }
      
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


  verPdfVenta(idVenta: any, identificacion: any, tipoVenta: any){
    
    /*if(tipoVenta != 'Factura'){
      console.log('solo se permite para Ventas Factuas');
      return;
    }*/
    let loadingRef = this.loadingService.open();

    this.coreService.getPdfFromVentaByIdEmp(this.idEmpresa,identificacion,idVenta,this.tokenValidate).subscribe({
      next: (data: any) => {
        loadingRef.close();

        this.resetControls();

        let downloadUrl = window.URL.createObjectURL(data);

        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', downloadUrl);
        //link.setAttribute('href', downloadUrl);
        link.setAttribute('download','detalle-venta');
        document.body.appendChild(link);
        link.click();
        link.remove();

      },
      error: (error: any) => {
        console.log('ocurrio un error');
        console.log(error);

        loadingRef.close();
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
    
    const regexOnlyNumber = new RegExp(/^\d+$/);

    if(numeroFac == 1){

      if(!this.value001 ){
        this.value001 = "001";
        this.getNextNumeroSecuencialtwo();
        return;
      }

      if(!regexOnlyNumber.test(this.value001) || this.value001 == '0'){
        this.getNextNumeroSecuencialtwo();
        this.value001 = "001";
        return;
      }

      this.value001 = (this.value001.length == 1) ? `00${this.value001}` :  this.value001
      this.value001 = (this.value001.length == 2) ? `0${this.value001}` :  this.value001
      
      this.getNextNumeroSecuencialtwo();
      return;
    }

    if(numeroFac == 2){
      if(!this.value002){
        this.value002 = "001";
        this.getNextNumeroSecuencialtwo();
        return;
      }

      if(!regexOnlyNumber.test(this.value002) || this.value002 == '0'){
        this.getNextNumeroSecuencialtwo();
        this.value002 = "001";
        return;
      }
      
      this.value002 = (this.value002.length == 1) ? `00${this.value002}` :  this.value002
      this.value002 = (this.value002.length == 2) ? `0${this.value002}` :  this.value002

      this.getNextNumeroSecuencialtwo();
      return;
    }

    if(!this.valueSecuencia){
      this.valueSecuencia = "1";
      return;
    }
    
  }

  private resetControls(){

        this.tipoDocSelect = 'Factura';
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

        this.getConsumidorFinalApi();
        this.getNextNumeroSecuencial();
  }

  cancelarClick(): void{
      this.location.back();
  }

  changeTipoDoc(){
      this.getNextNumeroSecuencial();
  }

  private getConfigVentaSinSecuencia(){
      this.coreService.getConfigByNameIdEmp(this.idEmpresa,'VENTAS_PERMITIR_INGRESAR_SIN_SECUENCIA', this.tokenValidate).subscribe({
        next: (data: any) => {

          if(data.data.length > 0) {
            const configReceive: ConfigReceive = data.data[0];
            this.permitirVentaSecuenciaIncorrecta = configReceive.con_valor === "1" ? true : false;
          }
        },
        error: (error) => {
          console.log('error get num decimales');
          console.log(error);
        }
      });
  }

  private getConfigIvaIncluidoEnVenta(){
      this.coreService.getConfigByNameIdEmp(this.idEmpresa,'VENTAS_IVA_INCLUIDO_FACTURA', this.tokenValidate).subscribe({
        next: (data: any) => {
        
          if(data.data && data.data.length > 0){
            
            const configReceive: ConfigReceive = data.data[0];

            this.configIvaIncluidoEnVenta = configReceive.con_valor === "1" ? true : false;
          }

          this.getDataRoutedMap();
        },
        error: (error) => {
          console.log('error get num decimales');
          console.log(error);
        }
      });
  }

  private getConfigImpresionDocumentosVenta(){
      this.coreService.getConfigByNameIdEmp(this.idEmpresa,'VENTAS_IMPRESION_DOCUMENTOS', this.tokenValidate).subscribe({
        next: (data: any) => {
          
          console.log('impresion documentoos venta');
          console.log(data.data);
          if(data.data && data.data.length > 0){
            
            const configReceive: ConfigReceive = data.data[0];

            this.configImpresionDocumentos = configReceive.con_valor; 
          }
        },
        error: (error) => {
          console.log('error get impresion documentos');
          console.log(error);
        }
      });
  }

}
