import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BuscarClienteDialogComponent } from 'src/app/components/buscar-cliente-dialog/buscar-cliente-dialog.component';
import { BuscarProductoDialogComponent } from 'src/app/components/buscar-producto-dialog/buscar-producto-dialog.component';
import { CrearClienteDialogComponent } from 'src/app/components/crear-cliente-dialog/crear-cliente-dialog.component';
import { ProductFactura } from 'src/app/interfaces/ProductFactura';

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

  constructor(private matDialog: MatDialog,
    public viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
  }

  nuevoClienteClick(){

    const dialogRef = this.matDialog.open(CrearClienteDialogComponent, {
      width: '100%',
      viewContainerRef: this.viewContainerRef
    });

  dialogRef.afterClosed().subscribe(result => {
    if(result){
      //this.deleteClienteApi(idCliente);
    }
  });
  }

  buscarClienteClick(){
    const dialogRef = this.matDialog.open(BuscarClienteDialogComponent, {
      width: '100%',
      viewContainerRef: this.viewContainerRef
    });

  dialogRef.afterClosed().subscribe(result => {
    if(result){
      //this.deleteClienteApi(idCliente);
      console.log('result dialog cliente click item');
      console.log(result);

      this.inputIdentificacion.nativeElement.value = result['cli_documento_identidad']
      this.inputNombreCliente.nativeElement.value = result['cli_nombres_natural']
      this.inputDirCliente.nativeElement.value = result['cli_direccion']

    }
  });
  }

  agregarProductoClick(){
    const dialogRef = this.matDialog.open(BuscarProductoDialogComponent, {
      width: '100%',
      viewContainerRef: this.viewContainerRef
    });

  dialogRef.afterClosed().subscribe(result => {
    if(result){

      const data = this.datasource.data;
      const productItemAdd = {
        codigo: result.prod_codigo,
        nombre: result.prod_nombre,
        precio: result.prod_pvp,
        cantidad: 2,
        iva: result.prod_iva_si_no
      }

      data.push(productItemAdd);
      this.datasource.data = data;

    }
  });
  }
}
