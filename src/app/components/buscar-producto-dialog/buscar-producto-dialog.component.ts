import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { Producto } from 'src/app/interfaces/Productos';
import { ConfigReceive } from 'src/app/pages/configuraciones/models/ConfigReceive';
import { ListVentaItemService } from 'src/app/pages/page-ventas/services/list-venta-items.service';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';
import { CantidadProductoDialogComponent } from '../cantidad-producto-dialog/cantidad-producto-dialog.component';

@Component({
  selector: 'app-buscar-producto-dialog',
  templateUrl: './buscar-producto-dialog.component.html',
  styleUrls: ['./buscar-producto-dialog.component.css']
})
export class BuscarProductoDialogComponent implements OnInit, AfterViewInit {

  boxSearchInput! : ElementRef<HTMLInputElement>;
  @ViewChild('boxSearchInput') set inputElRef(elRef: ElementRef<HTMLInputElement>){
    if(elRef){
      this.boxSearchInput = elRef;
    }
  }

  displayedColumns: string[] = ['codigo', 'nombre', 'marca','categoria','precio'];
  datasource = new MatTableDataSource<Producto>();

  idEmpresa: number = 0;
  rucEmpresa: string = '';
  nombreBd: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  listaProductos: Producto[] = [];
  textSearchProductos = '';

  showPagination = false;
  showSinDatos = false;

  fixedNumDecimal = 2;

  timeoutId?: number = undefined;
  
  constructor(private coreService: ApplicationProvider,
    public matDialogRef: MatDialogRef<BuscarProductoDialogComponent>,
    private loadingService: LoadingService,
    private ref: ChangeDetectorRef,
    private matDialog: MatDialog,
    private productVentaService: ListVentaItemService
    ) {}


  ngAfterViewInit(): void {
    setTimeout(() =>{
      this.boxSearchInput.nativeElement.focus();
      this.ref.detectChanges();
    }, 200);
  }

  ngOnInit(): void {

    //this.matDialogRef.disableClose = true;

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
    this.nombreBd = localServiceResponseUsr._nombreBd;

    //this.getListaProductosRefresh();
    this.getConfigNumDecimalesIdEmp();
  }

  searchProductosText(): void{

    clearTimeout(this.timeoutId);
    this.timeoutId = window.setTimeout(() => {
      this.callSearchApi();
    }, 400);

  }

  private callSearchApi(){
    let dialogRef = this.loadingService.open();

    this.coreService.searchProductosByIdEmpTextActivo(this.idEmpresa, this.textSearchProductos,this.nombreBd, this.tokenValidate).subscribe({
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

        const arrayProducts: Producto[] = data.data;
        const arrayWithDecimal = arrayProducts.map((producto: Producto) => {
          producto.prod_pvp = Number(producto.prod_pvp).toFixed(this.fixedNumDecimal);
          return producto;
        });

        this.listaProductos = arrayWithDecimal;
        this.datasource.data = this.listaProductos;
        this.ref.detectChanges();

        if(this.listaProductos.length == 1){
          //this.tableproduct.nativeElement.focus();
          /*console.log(this.tableproduct);
          console.log(this.tableproduct.nativeElement);*/
          //console.log(this.tablaProducto!!.);
        }
      },
      error: (error: any) => {
        dialogRef.close();
        this.showSinDatos = !this.showSinDatos;
      }
    });
  }

  private getListaProductosRefresh(){

    this.coreService.getListProductosByIdEmpActivo(this.idEmpresa, this.nombreBd,this.tokenValidate).subscribe({
      next: (data: any) => {

        const arrayProducts: Producto[] = data.data;

        const arrayWithDecimal = arrayProducts.map((producto: Producto) => {
          producto.prod_pvp = Number(producto.prod_pvp).toFixed(this.fixedNumDecimal);
          return producto;
        });

        //this.listaProductos = data.data;
        this.listaProductos = arrayWithDecimal;
        this.datasource.data = this.listaProductos;
        
      },
      error: (error) => {
      }
    });

  }

  clickSelectItem(dataProducto: any){
    //this.matDialogRef.close(dataProducto);
    //this.productVentaService.setProduct(dataProducto);

    const dialogRef = this.matDialog.open(CantidadProductoDialogComponent, {
      closeOnNavigation: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        dataProducto['prodCantSelected'] = result.cantidad;
        this.productVentaService.setProduct(dataProducto);
      }
    });
  }

  private getConfigNumDecimalesIdEmp(){
    this.coreService.getConfigByNameIdEmp(this.idEmpresa,'VENTA_NUMERODECIMALES', this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {

        if(data.data.length > 0){
          const configReceive: ConfigReceive = data.data[0];

          const splitValue = configReceive.con_valor.split('.');
          this.fixedNumDecimal = splitValue[1].length
        }


        this.getListaProductosRefresh();
      },
      error: (error) => {
        console.log('error get num decimales');
        console.log(error);
      }
    });
  }

  clearText(){
    if(this.textSearchProductos != ""){
      this.textSearchProductos = "";
      this.searchProductosText();

      this.boxSearchInput.nativeElement.focus();
      this.ref.detectChanges();
    }
  }
}
