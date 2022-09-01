import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
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
}
