import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDeleteDialogComponent } from 'src/app/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { Producto } from 'src/app/interfaces/Productos';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-page-inventario',
  templateUrl: './page-inventario.component.html',
  styleUrls: ['./page-inventario.component.css']
})
export class PageInventarioComponent implements OnInit {

  displayedColumns: string[] = ['codigo', 'codigoBarra', 'nombre', 'stock', 'unidadMedida', 'actions'];
  datasource = new MatTableDataSource<Producto>();

  showPagination = false;
  showSinDatos = false;
  isLoading = false;
  listaProductos: Producto[] = [];

  idEmpresa: number = 0;
  rucEmpresa: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('containerTable', {read: ElementRef}) tableInput!: ElementRef

  constructor(private coreService: ApplicationProvider,
              private localService: LocalService,
              private loadingService: LoadingService,
              private router: Router,
              private toastr: ToastrService,
              private matDialog: MatDialog) { }

  ngOnInit(): void {
    // GET INITIAL DATA 
    const localServiceResponseToken = this.localService.storageGetJsonValue('DATA_TOK');
    const localServiceResponseUsr = this.localService.storageGetJsonValue('DATA_USER');

    this.dataUser = localServiceResponseToken;
    const { token, expire } = this.dataUser;
    this.tokenValidate = { token, expire};

    this.idEmpresa = localServiceResponseUsr._bussId;
    this.rucEmpresa = localServiceResponseUsr._ruc;

    this.getListaProductosRefresh();
  }

  private getListaProductosRefresh(){

    this.isLoading = !this.isLoading;

    let dialogRef = this.loadingService.open();

    this.coreService.getListProductosByIdEmp(this.idEmpresa, this.tokenValidate).subscribe({
      next: (data: any) => {

        dialogRef.close();

        this.isLoading = !this.isLoading;

        this.listaProductos = data.data;

        if(this.listaProductos.length > 0){
          this.showPagination = true;
          this.showSinDatos = false
        }else{
          this.showSinDatos = !this.showSinDatos;
          this.showPagination = false
        }

        this.datasource.data = this.listaProductos;
        this.datasource.paginator = this.paginator;

      },
      error: (error) => {

        dialogRef.close();

        this.isLoading = !this.isLoading;
        this.showSinDatos = !this.showSinDatos;

      }
    });

  }

  nuevoProducto(){
    this.router.navigate(['inventario/nuevo']);
  }

  editarClick(idProducto: any){
    this.router.navigate(['inventario/editar', idProducto]);
  }
  eliminarClick(idProducto: any){
      const dialogRef = this.matDialog.open(ConfirmDeleteDialogComponent, {
        width: '250px',
        data: {title: 'Va a eliminar el producto, desea continuar?'}
      });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteProductoApi(idProducto);
      }
    });
  }

  private deleteProductoApi(idProducto: any): void{
    let dialogRef = this.loadingService.open();

    this.coreService.deleteProductoByIdEmp(idProducto, this.idEmpresa, this.tokenValidate).subscribe({
      next: (data: any) => {
        dialogRef.close();
        this.getListaProductosRefresh();
      },
      error: (error: any) => {
        dialogRef.close();
      }
    });
    
  }

}
