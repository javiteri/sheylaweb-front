import { ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { Producto } from 'src/app/interfaces/Productos';
import { ConfigReceive } from 'src/app/pages/configuraciones/models/ConfigReceive';
import { ListCompraItemsService } from 'src/app/pages/page-compras/services/list-compra-items.service';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';
import { BuscarProductoDialogComponent } from '../buscar-producto-dialog/buscar-producto-dialog.component';


export interface DialogData {
  selectInOneClick: boolean;
}

@Component({
  selector: 'app-buscar-producto-compra-dialog',
  templateUrl: './buscar-producto-compra-dialog.component.html',
  styleUrls: ['./buscar-producto-compra-dialog.component.css']
})
export class BuscarProductoCompraDialogComponent implements OnInit, OnDestroy {

  boxSearchInput! : ElementRef<HTMLInputElement>;
  @ViewChild('boxSearchInput') set inputElRef(elRef: ElementRef<HTMLInputElement>){
    if(elRef){
      this.boxSearchInput = elRef;
    }
  }
  
  displayedColumns: string[] = ['codigo', 'nombre','marca','categoria' ,'costo'];
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
  
  selectInOneClick = false;
  timeoutId?: number = undefined;

  constructor(private coreService: ApplicationProvider,
    public matDialogRef: MatDialogRef<BuscarProductoDialogComponent>,
    private loadingService: LoadingService,
    private ref: ChangeDetectorRef,
    private productService: ListCompraItemsService,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData
  ) { }

  ngAfterViewInit(): void {
    setTimeout(() =>{
      this.boxSearchInput.nativeElement.focus();
      this.ref.detectChanges();
    }, 200);
  }
  
  ngOnInit(): void {

    this.selectInOneClick = this.dialogData['selectInOneClick'];

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

  ngOnDestroy(): void{

  }

  searchProductosText(): void{
    clearTimeout(this.timeoutId);
    this.timeoutId = window.setTimeout(() => {
      this.callSearchApi();
    }, 500);

  }

  callSearchApi(): void{
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
          producto.prod_costo = 
                (producto.prod_iva_si_no == "1") ? ((Number(producto.prod_costo)) / 1.12).toFixed(this.fixedNumDecimal) 
                : (Number(producto.prod_costo)).toFixed(this.fixedNumDecimal);

          return producto;
        });

        this.datasource.data = arrayWithDecimal;
        this.ref.detectChanges();

      },
      error: (error: any) => {
        dialogRef.close();

        this.showSinDatos = !this.showSinDatos;
      }
    });
  }

  private getListaProductosRefresh(){

    this.coreService.getListProductosByIdEmpActivo(this.idEmpresa,this.nombreBd, this.tokenValidate).subscribe({
      next: (data: any) => {

        const arrayProducts: Producto[] = data.data;

        const arrayWithDecimal = arrayProducts.map((producto: Producto) => {

          producto.prod_costo = 
                (producto.prod_iva_si_no == "1") ? (Number(producto.prod_costo) / 1.12).toFixed(this.fixedNumDecimal) : producto.prod_costo
          return producto;
        });

        this.listaProductos = arrayWithDecimal;
        this.datasource.data = this.listaProductos;
      },
      error: (error) => {
      }
    });

  }

  clickSelectItem(dataProducto: any){
    if(this.selectInOneClick == true){
      this.matDialogRef.close(dataProducto);
      return;
    }
    this.productService.setProduct(dataProducto);
    //this.matDialogRef.close(dataProducto);
  }


  private getConfigNumDecimalesIdEmp(){
    this.coreService.getConfigByNameIdEmp(this.idEmpresa,'COMPRA_NUMERODECIMALES', this.tokenValidate, this.nombreBd).subscribe({
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
    }
  }
}
