import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { BuscarProductoCompraDialogComponent } from 'src/app/components/buscar-producto-compra-dialog/buscar-producto-compra-dialog.component';
import { BuscarProveedorDialogComponent } from 'src/app/components/buscar-proveedor-dialog/buscar-proveedor-dialog.component';
import { CrearProveedorDialogComponent } from 'src/app/components/crear-proveedor-dialog/crear-proveedor-dialog.component';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ProductCompra } from 'src/app/interfaces/ProductCompra';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';
import { ConfigReceive } from '../configuraciones/models/ConfigReceive';
import { ProveedorFactura } from './models/ProveedorFac';
import { ListCompraItemsService } from './services/list-compra-items.service';

@Component({
  selector: 'app-page-compras',
  templateUrl: './page-compras.component.html',
  styleUrls: ['./page-compras.component.css']
})
export class PageComprasComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['Codigo', 'Articulo', 'Cantidad', 'costo','descuento', 'P Total', 'actions'];
  datasource = new MatTableDataSource<ProductCompra>();

  sendDatosFormCompra : FormGroup;

  numeroAutorizacion : String = "";
  idEmpresa: number = 0;
  rucEmpresa: string = '';
  idUser: number = 0;
  nombreBd: string = '';
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
  
  NAMES_CONFIG_COMPRA = ["COMPRA_NUMERODECIMALES", "COMPRA_REFRESCAR_PVP_SEGUN_ULTIMA_COMPRA"];
  listFormaPago = ['EFECTIVO', 'CHEQUE', 'TRANSFERENCIA', 'VOUCHER', 'CREDITO'];
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
  formaPagoSelect = 'EFECTIVO';
  dateFac = new Date();
  cantItems = 0;

  fixedNumDecimal = 2;
  isRefrescarPvpSegunUltimaCompra = false;

  proveedorFac: ProveedorFactura = new ProveedorFactura(0, '999999999', 'PROVEEDOR GENERICO', 'PROVEEDOR GENERICO','','0999999999');

  subscription1$?: Subscription
  subscription2$?: Subscription
  datosProvsubscription$?: Subscription

  configValorIva = "12.00";
  valorIvaDecimal = "1.12";

  constructor(private matDialog: MatDialog,
    private toastr: ToastrService,
    private coreService: ApplicationProvider,
    private loadingService: LoadingService,
    private location: Location,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ListCompraItemsService) {

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
    this.nombreBd = localServiceResponseUsr._nombreBd;

    this.subscription1$ = this.productService.productList$.subscribe((listProductos: any) => {
      if(!(Object.entries(listProductos).length === 0)){

        const data = this.datasource.data;
        listProductos.forEach((elemento: any) => {
          const productItemAdd = {
            id: elemento.prodId,
            codigo: elemento.codigoInterno,
            nombre: elemento.descripcionInterna,
            costo: elemento.precioUnitario,
            precio: elemento.precioUnitario,
            cantidad: elemento.cantidad,
            descuento: elemento.descuento,
            iva: ((elemento.impuestos['impuesto']['codigoPorcentaje'] == '2') ||
                (elemento.impuestos['impuesto']['codigoPorcentaje'] == '8')) ? "1" : "0"
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
          cantidad: producto.prodCantSelected,
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

    this.datosProvsubscription$ = this.productService.datosProveedor$.subscribe((proveedor: any) => {
      
      if(!(Object.entries(proveedor).length === 0)){  
        this.proveedorFac.id = proveedor.dataInServer.id;
        this.proveedorFac.ciRuc = proveedor.identificacion;
        this.proveedorFac.nombre = proveedor.proveedor;
        this.proveedorFac.direccion = proveedor.direccion;
        this.proveedorFac.email = '';
        this.proveedorFac.telefono = proveedor.dataInServer.telefono;

        const arraySecuencial = proveedor.numero.split('-');
        this.value001 = arraySecuencial[0];
        this.value002 = arraySecuencial[1];
        this.valueSecuencia = arraySecuencial[2];

        const [day,month, year] = proveedor.fecha.split('/');
        const mDate = new Date(+year, +month - 1, +day);
        this.dateFac = mDate;

        this.sendDatosFormCompra.controls['numeroAutorizacionn'].setValue(proveedor.autorizacion);

        this.loadingSecuencial = false;

      }else{
        // SI NO SE OBTIENE DETALLES EN LA LISTA ENTONCES CRAGAR LOS DATOS POR DEFECTO
        this.getDataRoutedMap();
      }
    })
    
    this.getConfigNumDecimalesIdEmp();
    this.getConfigRefrescarPvpSegunCompra();

  }

  ngOnDestroy(): void {
    this.productService.setProductList([]);
    this.productService.setProveedor([]);
    this.productService.setProduct([]);

    this.subscription1$?.unsubscribe();
    this.subscription2$?.unsubscribe();
    this.datosProvsubscription$?.unsubscribe();
  }


  private getConfigNumDecimalesIdEmp(){
    this.coreService.getConfigByNameIdEmp(this.idEmpresa, this.NAMES_CONFIG_COMPRA[0], this.tokenValidate, this.nombreBd).subscribe({
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
  private getConfigRefrescarPvpSegunCompra(){
    this.coreService.getConfigByNameIdEmp(this.idEmpresa, this.NAMES_CONFIG_COMPRA[1], this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {

        if(data.data.length > 0){
          const configReceive: ConfigReceive = data.data[0];

          if(configReceive.con_valor == "0"){
            this.isRefrescarPvpSegunUltimaCompra = false;
          }else{
            this.isRefrescarPvpSegunUltimaCompra = true;
          }

        }

      },
      error: (error) => {
        console.log('error get refrescar pvp ultima compra');
        console.log(error);
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

  removeCart(indexItem: number){
    
    const data = this.datasource.data;
    data.splice(indexItem, 1);
    this.datasource.data = data;

    this.cantItems = this.datasource.data.length;
    // CALCULATE TOTAL VALUE IN ITEMS LIST
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
    
    //iva12 = ((subtotalIva12 * 12) / 100);
    iva12 = ((subtotalIva12 * Number(this.configValorIva)) / 100);
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
      let precioUnitario = data.costo;
      let totalSinIva = 0.0;

      /*if(data.iva == "1"){
        precioUnitario = (data.costo / 1.12);
      }else{
        precioUnitario = data.costo;
      }*/
      totalSinIva = precioUnitario * data.cantidad;
      precioTotal = (totalSinIva - ((totalSinIva * data.descuento) / 100));

      detallesCompra.push({
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
      compraNcId: 0,
      nombreBd: this.nombreBd,
      refrescarPvpSegunUltimaCompra: this.isRefrescarPvpSegunUltimaCompra
    }

    let overlayRef = this.loadingService.open();

    this.coreService.insertCompraFacturaToBD(sendCompraJsonModel, this.tokenValidate).subscribe({
      next: (data: any) => {
        overlayRef.close();

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
        this.toastr.error('Ocurrio un error, reintente', '', {
          timeOut: 4000,
          closeButton: true
        });
      }

    });
  }

  toXmlPage(){
    this.router.navigate(['/compras/xml-documento-electronico'], {state: {name: true}});
  }

  toXmlPageSri(){
    this.router.navigate(['/compras/xml-documento-electronico'], {state: {openSri: true}});
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

    this.loadingSecuencial = !this.loadingSecuencial

    this.coreService.getNextNumeroSecuencialCompraByIdEmp(this.idEmpresa, this.tipoDocSelect, 
                        this.proveedorFac.id,`${this.value001}-${this.value002}`,this.tokenValidate, this.nombreBd).subscribe({
      next: (response: any) => {
        this.loadingSecuencial = false;
        this.valueSecuencia = response.data;
      },
      error: (error) => {
        this.loadingSecuencial = false;
      }
    });
  }

  changeTipoDoc(){
    this.getNextNumeroSecuencial();
  }

  private resetControls(){

    this.tipoDocSelect = '01 Factura';
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
    this.sendDatosFormCompra.controls['numeroAutorizacionn'].setValue('');

    this.getProveedorGenericoApi();
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


  private getDataRoutedMap(){
    this.route.paramMap.subscribe((params: any) => {

      let idCompra = params.get('id');
      
      if(idCompra){
        this.coreService.getDataByIdCompra(idCompra, this.idEmpresa, this.tokenValidate, this.nombreBd).subscribe({
          next: (data: any) =>{

            this.loadingSecuencial = false;

            this.proveedorFac.id = data.data['proveedorId'];
            this.proveedorFac.ciRuc = data.data['cc_ruc_pasaporte'];
            this.proveedorFac.nombre = data.data['proveedor'];
            this.proveedorFac.telefono = data.data['proveedorTele'];
            this.proveedorFac.direccion = data.data['proveedorDir'];
            this.proveedorFac.email = data.data['proveedorEmail'];

            this.sustentoTributarioSelect = data.data['sustentoSri'];

            this.formaPagoSelect = data.data['forma_pago']
            const mDate = new Date(data.data['fechaHora']);
            this.dateFac = mDate;

            this.tipoDocSelect = data.data['documento'];
            this.sendDatosFormCompra.controls['numeroAutorizacionn'].setValue(data.data['numeroAutorizacion']);

            const valuesSecuenciales = data.data['numero'].split('-');
            this.value001 = valuesSecuenciales[0];
            this.value002 = valuesSecuenciales[1];
            this.valueSecuencia = valuesSecuenciales[2];

            let dataInSource = this.datasource.data;
            const arrayVentaDetalle = Array.from(data.data.data);

            let valorIva = arrayVentaDetalle.find((value: any) => {
              return Number(value['comprad_iva']) == 8; 
            }) as any;
            if(valorIva){
              let valorIvaDecimal = (Number(valorIva['comprad_iva']) / 100) + 1;
              this.configValorIva = valorIva['comprad_iva'];
              this.valorIvaDecimal = valorIvaDecimal.toFixed(4);
            }

            
            arrayVentaDetalle.forEach((data: any) => {

              const productItemAdd = {
                id: data.comprad_pro_id,
                codigo: data.prod_codigo,
                nombre: data.comprad_producto,
                costo: data.comprad_vu,
                precio: data.prod_precio,
                cantidad: data.comprad_cantidad,
                descuento: data.comprad_descuento,
                iva: (Number(data.comprad_iva) == 0) ? "0" : "1"
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
              this.toastr.error('No existe Compra', '', {
                timeOut: 4000,
                closeButton: true
              });

              this.router.navigate(['/compras/listacompra']);

            }
          }
        });

      }else{
        this.getConfigValorIvaIdEmp();
        this.getProveedorGenericoApi();
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
}
