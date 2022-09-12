import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatChip } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BuscarClienteDialogComponent } from 'src/app/components/buscar-cliente-dialog/buscar-cliente-dialog.component';
import { BuscarProductoDialogComponent } from 'src/app/components/buscar-producto-dialog/buscar-producto-dialog.component';
import { CrearClienteDialogComponent } from 'src/app/components/crear-cliente-dialog/crear-cliente-dialog.component';
import { ProductFactura } from 'src/app/interfaces/ProductFactura';
import { ClienteFactura } from './models/ClientFac';

@Component({
  selector: 'app-page-ventas',
  templateUrl: './page-ventas.component.html',
  styleUrls: ['./page-ventas.component.css']
})
export class PageVentasComponent implements OnInit {


  displayedColumns: string[] = ['#', 'Codigo', 'Articulo', 'Cantidad','descuento', 'P Unitario', 'P Total', 'actions'];
  datasource = new MatTableDataSource<ProductFactura>();

  @ViewChild('identificacion') inputIdentificacion: any; 
  @ViewChild('nombreCliente') inputNombreCliente: any; 
  @ViewChild('dirCliente') inputDirCliente: any;
  @ViewChild('telCliente') inputTelCliente: any;
  @ViewChild('generalContainer') containerGeneral!: ElementRef;

  @ViewChild('fechaFac') inputFechaFac: any;
  @ViewChild('formaPagoFac') inputFormaPagoFac: any;
  @ViewChild('tipoDocFac') inputTipoDocFac: any;
  /*picker: any;
  inputFormaPagoFac: any;*/
  
  loadingSecuencial = true;

  total: string = "00.0";
  subtotal: string = "00.0";
  subtotalIva0: string = "00.0";
  subtotalIva12: string = "00.0";
  Iva12: string = "00.0";

  clientFac: ClienteFactura = new ClienteFactura(0, '999999999', 'CONSUMIDOR FINAL', '','','0999999999');

  listFormaPago = ['Efectivo', 'Cheque', 'Transferencia', 'Voucher', 'Credito'];
  listTipoDocumento = ['Factura', 'Ticket', 'Nota de Venta'];

  tipoDocSelect = 'Factura';
  formaPagoSelect = 'Efectivo';

  constructor(private matDialog: MatDialog,
    public viewContainerRef: ViewContainerRef,
    private router: Router) {

    }

  ngOnInit(): void {

    //REQUEST DATA CONFIG SECUENCIAL
    setTimeout(() => {
      this.loadingSecuencial = !this.loadingSecuencial
    }, 3000);

    const fechaActual = new Date();
    
    //this.sendDatosFormCliente.controls['fechaNacimiento'].setValue(fechaNacimiento);
  }


  removeCart(indexItem: number){
    
    const data = this.datasource.data;
    data.splice(indexItem, 1);
    this.datasource.data = data;

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
        codigo: result.prod_codigo,
        nombre: result.prod_nombre,
        precio: result.prod_pvp,
        cantidad: 1,
        descuento: 0,
        iva: result.prod_iva_si_no
      }

      data.push(productItemAdd);
      this.datasource.data = data;

      // CALCULATE TOTAL VALUE IN ITEMS LIST
      this.calculateTotalItems();
    }
  });
  }

  // GUARDAR DATOS FACTURA
  guardarFactura(){
  
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
}
