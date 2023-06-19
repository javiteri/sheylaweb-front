import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { BuscarClienteDialogComponent } from 'src/app/components/buscar-cliente-dialog/buscar-cliente-dialog.component';
import { BuscarProductoDialogComponent } from 'src/app/components/buscar-producto-dialog/buscar-producto-dialog.component';
import { ConfirmDeleteDialogComponent } from 'src/app/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { CrearClienteDialogComponent } from 'src/app/components/crear-cliente-dialog/crear-cliente-dialog.component';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ProductFactura } from 'src/app/interfaces/ProductFactura';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingOverlayRef, LoadingService } from 'src/app/services/Loading.service';
import { ConfigReceive } from '../../configuraciones/models/ConfigReceive';
import { ClienteFactura } from '../../page-ventas/models/ClientFac';
import { ListVentaItemService } from '../../page-ventas/services/list-venta-items.service';

@Component({
  selector: 'app-crearproforma',
  templateUrl: './crearproforma.component.html',
  styleUrls: ['./crearproforma.component.css']
})
export class CrearproformaComponent implements OnInit {

  displayedColumns: string[] = [/*'#',*/ 'Codigo', 'Articulo', 'Cantidad', 'P Unitario','descuento', 'P Total', 'actions'];
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
  nombreBd: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;
  
  numeroProforma:string = "1";
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
  permitirProformaSecuenciaIncorrecta = false;
  configIvaIncluidoEnVenta = true;

  configImpresionDocumentos = "1";

  subscriptionProductoProforma$?: Subscription;
  subscriptionListProductoProforma$?: Subscription;

  configValorIva = "12.00";
  valorIvaDecimal = "1.12";

  constructor(private matDialog: MatDialog,
    public viewContainerRef: ViewContainerRef,
    private toastr: ToastrService,
    private coreService: ApplicationProvider,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private router: Router,
    public ref: ChangeDetectorRef,
    private productProformaService: ListVentaItemService) { }

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

    this.subscriptionProductoProforma$ = this.productProformaService.selectedProduct$.subscribe((producto: any) => {

      if(!(Object.entries(producto).length === 0)){

        const data = this.datasource.data;
        const productItemAdd: ProductFactura = {
          id: producto.prod_id,
          codigo: producto.prod_codigo,
          nombre: producto.prod_nombre,
          precio: producto.prod_pvp,
          cantidad: producto.prodCantSelected,
          descuento: 0,
          iva: producto.prod_iva_si_no
        }

        if(!this.configIvaIncluidoEnVenta){
          if(productItemAdd.iva == "1"){
            productItemAdd.precio = Number((productItemAdd.precio / Number(this.valorIvaDecimal)).toFixed(this.fixedNumDecimal));
          }
        }

        data.push(productItemAdd);

        this.datasource.data = data;
        this.cantItems = this.datasource.data.length;
        // CALCULATE TOTAL VALUE IN ITEMS LIST
        this.calculateTotalItems();
      }
    });


    this.getConfigNumDecimalesIdEmp();
    this.getConfigProformaSinSecuencia();
    this.getConfigIvaIncluidoEnVenta();
    this.getConfigImpresionDocumentosProforma();
  }

  ngOnDestroy(): void {
    this.productProformaService.setProductList([]);
    this.productProformaService.setProduct([]);

    this.subscriptionProductoProforma$?.unsubscribe();
    this.subscriptionListProductoProforma$?.unsubscribe();
  }

  private getConfigNumDecimalesIdEmp(){
    this.coreService.getConfigByNameIdEmp(this.idEmpresa,'VENTA_NUMERODECIMALES', this.tokenValidate, this.nombreBd).subscribe({
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

  private getDataRoutedMap(){
    this.route.paramMap.subscribe((params: any) => {

      let idProforma = params.get('id');
      
      if(idProforma){
        this.coreService.getDataByIdProforma(idProforma, this.idEmpresa,this.rucEmpresa, this.tokenValidate, this.nombreBd).subscribe({
          next: (data: any) =>{

            this.clientFac.id = data.data['clienteId'];
            this.clientFac.ciRuc = data.data['cc_ruc_pasaporte'];
            this.clientFac.nombre = data.data['cliente'];
            this.clientFac.telefono = data.data['clienteTele'];
            this.clientFac.direccion = data.data['clienteDir'];
            this.clientFac.email = data.data['clienteEmail'];

            this.formaPagoSelect = data.data['forma_pago'];
            const mDate = new Date(data.data['fechaHora']);
            this.dateFac = mDate;

            this.numeroProforma = data.data['numero'];
            this.loadingSecuencial = false;

            let dataInSource = this.datasource.data;
            const arrayVentaDetalle = Array.from(data.data.data);

            let valorIva = arrayVentaDetalle.find((value: any) => {
              return Number(value['profd_iva']) == 8; 
            }) as any;
            if(valorIva){
              let valorIvaDecimal = (Number(valorIva['profd_iva']) / 100) + 1;
              this.configValorIva = valorIva['profd_iva'];
              this.valorIvaDecimal = valorIvaDecimal.toFixed(4);
            }

            arrayVentaDetalle.forEach((data: any) => {

              const productItemAdd: ProductFactura = {
                id: data.profd_prod_id,
                codigo: data.prod_codigo,
                nombre: data.profd_producto,
                precio: Number(Number(data.profd_vu).toFixed(this.fixedNumDecimal)),
                cantidad: data.profd_cantidad,
                descuento: data.profd_descuento,
                iva: (data.profd_iva == "0.00") ? "0" : "1"
              }

              if(this.configIvaIncluidoEnVenta){
                
                if(productItemAdd.iva == "1"){
                  
                  productItemAdd.precio = ((productItemAdd.precio * Number(this.valorIvaDecimal)).toFixed(this.fixedNumDecimal) as any);
                }
              }              

              dataInSource.push(productItemAdd);
        
            });

            this.observacion =data.data['Observaciones'];

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
              this.toastr.error('No existe Proforma', '', {
                timeOut: 4000,
                closeButton: true
              });

              this.router.navigate(['/clientes/lista-proformas']);

            }
          }
        });

      }else{
        this.getNextNumeroSecuencial();
        this.getConsumidorFinalApi();
        this.getConfigValorIvaIdEmp();
      }

    });
  }

  private getConfigIvaIncluidoEnVenta(){
    this.coreService.getConfigByNameIdEmp(this.idEmpresa,'VENTAS_IVA_INCLUIDO_FACTURA', this.tokenValidate, this.nombreBd).subscribe({
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

  private getConfigProformaSinSecuencia(){
    this.coreService.getConfigByNameIdEmp(this.idEmpresa,'PROFORMAS_PERMITIR_INGRESAR_SIN_SECUENCIA', this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {
        if(data.data.length > 0) {
          const configReceive: ConfigReceive = data.data[0];
          this.permitirProformaSecuenciaIncorrecta = configReceive.con_valor === "1" ? true : false;
        }
      },
      error: (error) => {
        console.log('error get num decimales');
        console.log(error);
      }
    });
  }

  private getConfigImpresionDocumentosProforma(){
    this.coreService.getConfigByNameIdEmp(this.idEmpresa,'PROFORMAS_IMPRESION_DOCUMENTOS', this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {
        
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

  private getConfigValorIvaIdEmp(){
    this.coreService.getConfigByNameIdEmp(this.idEmpresa,'FACTURA_VALORIVA', this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {
        if(data.data.length > 0) {
          //conversion valor iva a decimal
          let valorIvaDecimal = (Number(data.data[0].con_valor) / 100) + 1;
          this.configValorIva = data.data[0].con_valor;
          this.valorIvaDecimal = valorIvaDecimal.toFixed(4);
        }

      },
      error: (error) => {
        console.log('error get num decimales');
        console.log(error);
      }
    });
  }

  calcularIvaTemplate(){
    return parseInt(this.configValorIva);
  }

  // GUARDAR DATOS PROFORMA
  guardarProforma(){

    if(!this.validateClienteFac()){
      this.toastr.error('Verifique que los datos de Cliente sean correctos', '', {
        timeOut: 4000,
        closeButton: true
      });

      return;
    }

    if(!this.validateDatosFac()){
      this.toastr.error('Verifique que los datos de Proforma sean correctos', '', {
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
    const detallesProforma: any = []
    this.datasource.data.forEach(data => {

      let precioTotal = 0.0
      let precioUnitario = data.precio;
      let totalSinIva = 0.0;

      if(this.configIvaIncluidoEnVenta){
        if(data.iva == "1"){
          precioUnitario = Number((data.precio / Number(this.valorIvaDecimal)).toFixed(this.fixedNumDecimal));
        }
      }

      totalSinIva = Number((precioUnitario * data.cantidad).toFixed(this.fixedNumDecimal));
      precioTotal = Number((totalSinIva - ((totalSinIva * data.descuento) / 100)).toFixed(this.fixedNumDecimal));

      detallesProforma.push({
        prodId: data.id,
        cantidad: data.cantidad,
        iva: (data.iva == "1" ? this.configValorIva : "0.00"),
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

    const sendProformaJsonModel = {
      empresaId: this.idEmpresa,
      proformaNumero: this.numeroProforma,
      proformaFechaHora: dateString,
      usuId: this.idUser,
      clienteId: this.clientFac.id,
      subtotal12: this.subtotalIva12,
      subtotal0: this.subtotalIva0,
      valorIva: this.Iva12,
      ventaTotal: this.total,
      formaPago: this.formaPagoSelect.toUpperCase(),
      obs: this.observacion,
      proformaDetalles: detallesProforma,
      nombreBd: this.nombreBd
    }

    let overlayRef = this.loadingService.open();

    this.coreService.getNextNumeroProformaByUsuario(this.idEmpresa, 
      this.idUser, this.tokenValidate, this.nombreBd).subscribe({
      next: (response: any) => {

        const valorSecuencial = response.numeroProf;
        if(Number(this.numeroProforma) > valorSecuencial){
          if(this.permitirProformaSecuenciaIncorrecta){
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
                this.insertProformaToBD(sendProformaJsonModel, dialogRef);
              }
        
            });


          }else{
            overlayRef.close();
            this.toastr.error('No se permite ingresar secuencia Incorrecta', '', {
              timeOut: 4000,
              closeButton: true
            });
            this.getNextNumeroSecuencial();
          }

        }else{
          this.insertProformaToBD(sendProformaJsonModel, overlayRef);
        }        
      },
      error: (error) => {
        overlayRef.close();
        console.log(error);
      }
    });
  }

  private insertProformaToBD(sendProformaJsonModel: any, overlayRef: LoadingOverlayRef){
    this.coreService.insertProformaToBD(sendProformaJsonModel, this.tokenValidate).subscribe({
      next: (data: any) => {
        overlayRef.close();

        if(data['isDuplicate']){
          this.toastr.error('Ya esta en uso el Numero de Proforma', '', {
            timeOut: 4000,
            closeButton: true
          });
          
          this.secuencial.nativeElement.focus();
          this.getNextNumeroSecuencial();
          return;
        }

        if(this.configImpresionDocumentos == '1'){
          this.toastr.success('Proforma Guardada Correctamente', '', {
            timeOut: 4000,
            closeButton: true
          });

          this.verPdfProforma(data.proformaId, this.inputIdentificacion.nativeElement.value);
        }else{

          this.router.navigate([
            { outlets: {
              'print': ['print','receipt-proforma',data.proformaId]
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


  private validateClienteFac(): boolean{
    return (this.clientFac && this.clientFac['id'] != 0);
  }

  private validateDatosFac(): boolean{
    return true;
  }

  private validateListProduct(): boolean{
    return this.datasource.data.length > 0
  }

  cancelarClick(): void{
    //this.location.back();
    this.router.navigate(['clientes/lista-proformas']);
  }

  removeCart(indexItem: number){
    
    const data = this.datasource.data;
    data.splice(indexItem, 1);
    this.datasource.data = data;

    this.cantItems = this.datasource.data.length;
    // CALCULATE TOTAL VALUE IN ITEMS LIST
    this.calculateTotalItems();
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
          result = ((item.cantidad * item.precio) / Number(this.valorIvaDecimal));
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
    
    // iva12 = ((subtotalIva12 * 12) / 100);
    iva12 = ((subtotalIva12 * Number(this.configValorIva)) / 100);
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

  agregarProductoClick(){
    const dialogRef = this.matDialog.open(BuscarProductoDialogComponent, {
      width: '100%',
      closeOnNavigation: true,
      viewContainerRef: this.viewContainerRef
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

  changeNumFac(numeroFac: number){
    
    const regexOnlyNumber = new RegExp(/^\d+$/);

    if(!this.numeroProforma ){
      this.numeroProforma = "1";
      this.getNextNumeroSecuencial();
      return;
    }

    if(!regexOnlyNumber.test(this.numeroProforma) || this.numeroProforma == '0'){
      this.getNextNumeroSecuencial();
      this.numeroProforma = "1";
      return;
    }

    this.getNextNumeroSecuencial();

  }

  private resetControls(){

        this.tipoDocSelect = 'Factura';
        this.dateFac = new Date();
        this.formaPagoSelect = 'EFECTIVO';
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

  private getConsumidorFinalApi(){
    this.coreService.getConsumidorFinalOrCreate(this.idEmpresa, this.tokenValidate, this.nombreBd).subscribe({
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

    this.coreService.getNextNumeroProformaByUsuario(this.idEmpresa, this.idUser, this.tokenValidate, this.nombreBd).subscribe({
        next:(response: any) => {
          this.numeroProforma = response.numeroProf;
          this.loadingSecuencial = false;
        },
        error: (error: any) => {
          this.loadingSecuencial = false;
          console.log('error obteniendo no punto de venta');
        }
    });

  }


  verPdfProforma(idProforma: any, identificacion: any){
    
    let loadingRef = this.loadingService.open();

    this.coreService.getPdfFromProformaByIdEmp(this.idEmpresa, identificacion, idProforma, this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {
        loadingRef.close();

        let downloadUrl = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', downloadUrl);
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
}
