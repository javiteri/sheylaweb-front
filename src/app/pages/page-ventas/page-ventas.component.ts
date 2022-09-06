import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BuscarClienteDialogComponent } from 'src/app/components/buscar-cliente-dialog/buscar-cliente-dialog.component';
import { CrearClienteDialogComponent } from 'src/app/components/crear-cliente-dialog/crear-cliente-dialog.component';
import { ProductFactura } from 'src/app/interfaces/ProductFactura';

@Component({
  selector: 'app-page-ventas',
  templateUrl: './page-ventas.component.html',
  styleUrls: ['./page-ventas.component.css']
})
export class PageVentasComponent implements OnInit {


  displayedColumns: string[] = ['#', 'Codigo', 'Articulo', 'Cantidad', 'P Unitario', 'P Total', 'actions'];
  datasource = new MatTableDataSource<ProductFactura>();

  @ViewChild('identificacion') inputIdentificacion: any; 
  @ViewChild('nombreCliente') inputNombreCliente: any; 
  @ViewChild('dirCliente') inputDirCliente: any; 

  loadingSecuencial = true;

  constructor(private matDialog: MatDialog,
    public viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {

    //REQUEST DATA CONFIG SECUENCIAL
    setTimeout(() => {
      this.loadingSecuencial = !this.loadingSecuencial
    }, 3000);

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
}
