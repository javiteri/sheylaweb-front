import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { Producto } from 'src/app/interfaces/Productos';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-buscar-producto-dialog',
  templateUrl: './buscar-producto-dialog.component.html',
  styleUrls: ['./buscar-producto-dialog.component.css']
})
export class BuscarProductoDialogComponent implements OnInit {

  displayedColumns: string[] = ['codigo', 'nombre', 'precio'];
  datasource = new MatTableDataSource<Producto>();

  idEmpresa: number = 0;
  rucEmpresa: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  listaProductos: Producto[] = [];
  textSearchProductos = '';

  showPagination = false;
  showSinDatos = false;

  constructor(private coreService: ApplicationProvider,
    private localService: LocalService,
    public matDialogRef: MatDialogRef<BuscarProductoDialogComponent>,
    private loadingService: LoadingService,
    private ref: ChangeDetectorRef
  ) { 

  }

  ngOnInit(): void {

    this.matDialogRef.disableClose = true;

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

  searchProductosText(): void{

    let dialogRef = this.loadingService.open();

    this.coreService.searchProductosByIdEmpText(this.idEmpresa, this.textSearchProductos, this.tokenValidate).subscribe({
      next: (data: any) => {
        dialogRef.close();

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

      },
      error: (error: any) => {
        dialogRef.close();

        this.showSinDatos = !this.showSinDatos;
      }
    });
  }

  private getListaProductosRefresh(){

    /*this.isLoading = !this.isLoading;

    let dialogRef = this.loadingService.open();*/

    this.coreService.getListProductosByIdEmp(this.idEmpresa, this.tokenValidate).subscribe({
      next: (data: any) => {

        this.listaProductos = data.data;
        this.datasource.data = this.listaProductos;
        /*dialogRef.close();

        this.isLoading = !this.isLoading;

        this.listaClientes = data.data;

        if(this.listaClientes.length > 0){
          this.showPagination = true;//!this.showPagination;
          this.showSinDatos = false
        }else{
          this.showSinDatos = !this.showSinDatos;
          this.showPagination = false
        }

        this.datasource.data = this.listaClientes;
        this.ref.detectChanges();
        this.datasource.paginator = this.paginator;*/

      },
      error: (error) => {

        /*dialogRef.close();

        this.isLoading = !this.isLoading;
        this.showSinDatos = !this.showSinDatos;*/

      }
    });

  }

  clickSelectItem(dataProducto: any){
    this.matDialogRef.close(dataProducto);
  }
}
