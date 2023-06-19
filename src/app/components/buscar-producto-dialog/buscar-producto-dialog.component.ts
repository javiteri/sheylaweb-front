import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ToastrService } from 'ngx-toastr';
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
  
  isShowDialog: boolean = false;
  isEstablecerCantidadInSelectProduct: boolean = true;

  constructor(private coreService: ApplicationProvider,
    public matDialogRef: MatDialogRef<BuscarProductoDialogComponent>,
    private loadingService: LoadingService,
    private ref: ChangeDetectorRef,
    private matDialog: MatDialog,
    private productVentaService: ListVentaItemService,
    private toastr: ToastrService
    ) {}


  ngAfterViewInit(): void {
    setTimeout(() =>{
      this.boxSearchInput.nativeElement.focus();
      this.ref.detectChanges();
    }, 200);
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
    this.nombreBd = localServiceResponseUsr._nombreBd;

    this.getConfigEstablecerCantidadSelectProd();
    this.getConfigNumDecimalesIdEmp();
  }

  searchProductosText(): void{
    clearTimeout(this.timeoutId);
    this.timeoutId = window.setTimeout(() => {
      this.callSearchApi();
    }, 500);

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

        if(this.listaProductos.length == 1 && this.textSearchProductos.length > 0){
          setTimeout(() => {
            this.clickSelectItem(this.listaProductos[0]);
          }, 300);
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

        this.listaProductos = arrayWithDecimal;
        this.datasource.data = this.listaProductos;
      },
      error: (error) => {}
    });

  }

  clickSelectItem(dataProducto: any){

    //Ya se esta mostrando el dialogo
    if(this.isShowDialog){
      return;
    }

    if(!this.isEstablecerCantidadInSelectProduct){
        dataProducto['prodCantSelected'] = 1;
        this.productVentaService.setProduct(dataProducto);
        this.boxSearchInput.nativeElement.select();
        
        this.toastr.success('Producto Agregado', '', {
          timeOut: 2000,
          closeButton: true
        });

        return;
    }

    this.isShowDialog = true;    
    const dialogRef = this.matDialog.open(CantidadProductoDialogComponent, {
      closeOnNavigation: true
    });

    dialogRef.afterClosed().subscribe(result => {

      this.isShowDialog = false;
      this.boxSearchInput.nativeElement.select();
      if(result){
        dataProducto['prodCantSelected'] = result.cantidad;
        this.productVentaService.setProduct(dataProducto);

        this.toastr.success('Producto Agregado', '', {
          timeOut: 2000,
          closeButton: true
        });
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

  private getConfigEstablecerCantidadSelectProd(){
    this.coreService.getConfigByNameIdEmp(this.idEmpresa,'VENTAS_PREGUNTAR_CANTIDAD_PRODUCTO_SELECT', this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {

        if(data.data.length > 0){
          this.isEstablecerCantidadInSelectProduct = (data.data[0].con_valor == "0") ? false : true;
        }

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
