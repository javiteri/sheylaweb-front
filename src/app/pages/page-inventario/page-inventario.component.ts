import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmDeleteDialogComponent } from 'src/app/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { Producto } from 'src/app/interfaces/Productos';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';

@Component({
  selector: 'app-page-inventario',
  templateUrl: './page-inventario.component.html',
  styleUrls: ['./page-inventario.component.css']
})
export class PageInventarioComponent implements OnInit {

  displayedColumns: string[] = ['codigo', 'codigoBarra', 'nombre', 'stock', 'unidadMedida', 'categoria', 'marca','actions'];
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

  textSearchProductos = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('containerTable', {read: ElementRef}) tableInput!: ElementRef

  constructor(private coreService: ApplicationProvider,
              private loadingService: LoadingService,
              private router: Router,
              private matDialog: MatDialog,
              private ref: ChangeDetectorRef) { }

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
        this.ref.detectChanges();
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

  searchProductosText(): void{

    this.isLoading = !this.isLoading;

    let dialogRef = this.loadingService.open();

    this.coreService.searchProductosByIdEmpText(this.idEmpresa, this.textSearchProductos, this.tokenValidate).subscribe({
      next: (data: any) => {
        dialogRef.close();
        this.isLoading = !this.isLoading;

        this.listaProductos = data.data;

        if(this.listaProductos.length > 0){
          this.showPagination = true;
          this.showSinDatos = false
        }else{
          this.showSinDatos = true;
          this.showPagination = false
        }

        this.datasource.data = this.listaProductos;
        this.ref.detectChanges();
        this.datasource.paginator = this.paginator;

      },
      error: (error: any) => {
        dialogRef.close();

        this.isLoading = !this.isLoading;
        this.showSinDatos = !this.showSinDatos;
      }
    });
  }

  
}
