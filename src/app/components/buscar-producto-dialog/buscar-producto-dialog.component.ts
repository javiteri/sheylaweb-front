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

  searchProductosText(): void{

    let dialogRef = this.loadingService.open();

    this.coreService.searchProductosByIdEmpTextActivo(this.idEmpresa, this.textSearchProductos, this.tokenValidate).subscribe({
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

    this.coreService.getListProductosByIdEmpActivo(this.idEmpresa, this.tokenValidate).subscribe({
      next: (data: any) => {

        this.listaProductos = data.data;
        this.datasource.data = this.listaProductos;
        

      },
      error: (error) => {
      }
    });

  }

  clickSelectItem(dataProducto: any){
    this.matDialogRef.close(dataProducto);
  }
}
