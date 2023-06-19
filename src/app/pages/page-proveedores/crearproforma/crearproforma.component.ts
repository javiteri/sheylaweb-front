import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { BuscarProductoCompraDialogComponent } from 'src/app/components/buscar-producto-compra-dialog/buscar-producto-compra-dialog.component';
import { BuscarProveedorDialogComponent } from 'src/app/components/buscar-proveedor-dialog/buscar-proveedor-dialog.component';
import { ConfirmDeleteDialogComponent } from 'src/app/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { CrearProveedorDialogComponent } from 'src/app/components/crear-proveedor-dialog/crear-proveedor-dialog.component';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ProductCompra } from 'src/app/interfaces/ProductCompra';
import { ProveedorFactura } from 'src/app/pages/page-compras/models/ProveedorFac';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingOverlayRef, LoadingService } from 'src/app/services/Loading.service';
import { ConfigReceive } from '../../configuraciones/models/ConfigReceive';
import { ListCompraItemsService } from '../../page-compras/services/list-compra-items.service';

@Component({
  selector: 'app-crearproforma',
  templateUrl: './crearproforma.component.html',
  styleUrls: ['./crearproforma.component.css']
})
export class CrearproformaComponent implements OnInit {

  displayedColumns: string[] = [/*'#',*/ 'Codigo', 'Articulo', 'Cantidad', 'costo','descuento', 'P Total', 'actions'];
  datasource = new MatTableDataSource<ProductCompra>();

  @ViewChild('identificacion') inputIdentificacion: any; 
  @ViewChild('nombreCliente') inputNombreCliente: any; 
  @ViewChild('dirCliente') inputDirCliente: any;
  @ViewChild('telCliente') inputTelCliente: any;
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

  proveedorFac: ProveedorFactura = new ProveedorFactura(0, '999999999', 'PROVEEDOR GENERICO', 'PROVEEDOR GENERICO','','0999999999');

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

  subscription1$?: Subscription;
  subscription2$?: Subscription;
  
  constructor(
    private matDialog: MatDialog,
    public viewContainerRef: ViewContainerRef,
    private toastr: ToastrService,
    private coreService: ApplicationProvider,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private router: Router,
    public ref: ChangeDetectorRef,
    private productService: ListCompraItemsService
  ) { }

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


    this.subscription1$ = this.productService.productList$.subscribe((listProductos: any) => {
      if(!(Object.entries(listProductos).length === 0)){

        const data = this.datasource.data;
        listProductos.forEach((elemento: any) => {
          const productItemAdd = {
            id: 0,
            codigo: elemento.codigoInterno,
            nombre: elemento.descripcionInterna,
            costo: elemento.precioUnitario,
            precio: elemento.precioUnitario,
            cantidad: elemento.cantidad,
            descuento: elemento.descuento,
            iva: (elemento.impuestos['impuesto']['codigoPorcentaje'] == '2') ? "1" : "0"
          }
          
          data.push(productItemAdd);

        });

        this.datasource.data = data;
        
        this.calculateTotalItems();
      }
    });

    this.subscription2$ = this.productService.selectedProduct$.subscribe((producto: any) => {

      if(!(Object.entries(producto).length === 0)){

        const data = this.datasource.data;
        const productItemAdd = {
          id: producto.prod_id,
          codigo: producto.prod_codigo,
          nombre: producto.prod_nombre,
          costo: producto.prod_costo,
          precio: producto.prod_pvp,
          cantidad: 1,
          descuento: 0,
          iva: producto.prod_iva_si_no
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

  private getConfigNumDecimalesIdEmp(){

    this.coreService.getConfigByNameIdEmp(this.idEmpresa,'COMPRA_NUMERODECIMALES', this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {

        if(data.data.length > 0){
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


  private getDataRoutedMap(){
    this.route.paramMap.subscribe((params: any) => {

      let idProforma = params.get('id');
      
      if(idProforma){
        this.coreService.getDataByIdProforma(idProforma, this.idEmpresa,this.rucEmpresa, this.tokenValidate, this.nombreBd).subscribe({
          next: (data: any) =>{

            this.loadingSecuencial = false;

            this.proveedorFac.id = data.data['proveedorId'];
            this.proveedorFac.ciRuc = data.data['cc_ruc_pasaporte'];
            this.proveedorFac.nombre = data.data['proveedor'];
            this.proveedorFac.telefono = data.data['proveedorTele'];
            this.proveedorFac.direccion = data.data['proveedorDir'];
            this.proveedorFac.email = data.data['proveedorEmail'];

            this.formaPagoSelect = data.data['forma_pago'];
            const mDate = new Date(data.data['fechaHora']);
            this.dateFac = mDate;

            this.numeroProforma = data.data['numero'];
            this.loadingSecuencial = false;

            let dataInSource = this.datasource.data;
            const arrayVentaDetalle = Array.from(data.data.data);
            arrayVentaDetalle.forEach((data: any) => {

              const productItemAdd = {
                id: data.comprad_pro_id,
                codigo: data.prod_codigo,
                nombre: data.comprad_producto,
                costo: data.comprad_vu,
                precio: data.prod_precio,
                cantidad: data.comprad_cantidad,
                descuento: data.comprad_descuento,
                iva: (data.comprad_iva == "0.00") ? "0" : "1"
              }

              /*if(this.configIvaIncluidoEnVenta){
                
                if(productItemAdd.iva == "1"){
                  
                  productItemAdd.precio = ((productItemAdd.precio * 1.12).toFixed(this.fixedNumDecimal) as any);
                }
              } */             

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

              this.router.navigate(['/proveedores/lista-proformas']);

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
    this.coreService.getProveedorGenericoOrCreate(this.idEmpresa, this.tokenValidate, this.nombreBd).subscribe({
      next: (response: any) => {

        const datosConsuFinal = response['data'];

        this.proveedorFac.id = datosConsuFinal['pro_id'];
        this.proveedorFac.ciRuc = datosConsuFinal['pro_documento_identidad'];
        this.proveedorFac.nombre = datosConsuFinal['pro_nombre_natural'];
        this.proveedorFac.telefono = datosConsuFinal['pro_telefono'];
        this.proveedorFac.direccion =  datosConsuFinal['pro_direccion'];
        this.proveedorFac.email = datosConsuFinal['pro_email'];

        this.getNextNumeroSecuencial();
      },
      error: (error) => {
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

    this.datasource.data.forEach((item: ProductCompra, index: number) => {

        result = (item.cantidad * item.costo);
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
    console.log(productItem.costo);
    if(!productItem.costo || productItem.costo <= 0){
      const value = (1).toFixed(this.fixedNumDecimal);
      productItem.costo = (value as any);
      return;
    }

    let productoCosto = productItem.costo;
    const value = Number(productoCosto).toFixed(this.fixedNumDecimal);
    productItem.costo = (value as any);

    this.calculateTotalItems();
  }

  agregarProductoClick(){
    const dialogRef = this.matDialog.open(BuscarProductoCompraDialogComponent, {
      width: '100%',
      closeOnNavigation: true,
      data: {selectInOneClick: false}
    });

  dialogRef.afterClosed().subscribe(result => {
    if(result){

      const data = this.datasource.data;
      const productItemAdd = {
        id: result.prod_id,
        codigo: result.prod_codigo,
        nombre: result.prod_nombre,
        costo: result.prod_costo,//(result.prod_iva_si_no == "1") ? (result.prod_costo / 1.12).toFixed(this.fixedNumDecimal) : result.prod_costo,
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


  // GUARDAR DATOS PROFORMA
  guardarProforma(){

    if(!this.validateClienteFac()){
      this.toastr.error('Verifique que los datos de Proveedor sean correctos', '', {
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
          precioUnitario = Number((data.precio / 1.12).toFixed(this.fixedNumDecimal));
        }
      }

      totalSinIva = Number((precioUnitario * data.cantidad).toFixed(this.fixedNumDecimal));
      precioTotal = Number((totalSinIva - ((totalSinIva * data.descuento) / 100)).toFixed(this.fixedNumDecimal));

      detallesProforma.push({
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

    const sendProformaJsonModel = {
      empresaId: this.idEmpresa,
      proformaNumero: this.numeroProforma,
      proformaFechaHora: dateString,
      usuId: this.idUser,
      clienteId: this.proveedorFac.id,
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

    this.coreService.getNextNumeroProformaByUsuario(this.idEmpresa, this.idUser, this.tokenValidate, this.nombreBd).subscribe({
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

      this.getNextNumeroSecuencial();
    }
  });
  }

  nuevoProveedorClick(){

    const dialogRef = this.matDialog.open(CrearProveedorDialogComponent, {
      width: '100%',
      closeOnNavigation: true
    });

  dialogRef.afterClosed().subscribe(result => {
    if(result){
      this.proveedorFac.id = result.data['id'];
      this.proveedorFac.ciRuc = result.data['ciRuc'];
      this.proveedorFac.nombre = result.data['nombre'];
      this.proveedorFac.direccion = result.data['direccion'];
      this.proveedorFac.email = result.data['email'];
      this.proveedorFac.telefono = result.data['telefono'];

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
    return (this.proveedorFac && this.proveedorFac['id'] != 0);
  }

  private validateDatosFac(): boolean{
    return true;
  }

  private validateListProduct(): boolean{
    return this.datasource.data.length > 0
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


  ngOnDestroy(): void {
    this.productService.setProductList([]);
    this.productService.setProduct([]);

    this.subscription1$?.unsubscribe();
    this.subscription2$?.unsubscribe();
  }

}
