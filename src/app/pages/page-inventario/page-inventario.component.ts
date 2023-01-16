import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import * as XLSX from 'xlsx';
import { ImportarProductosDialogComponent } from './dialogs/importar-productos-dialog/importar-productos-dialog.component';

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
  nombreBd: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  textSearchProductos = '';
  file: File | null = null;
  arrayBuffer: any

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('containerTable', {read: ElementRef}) tableInput!: ElementRef

  constructor(private coreService: ApplicationProvider,
              private loadingService: LoadingService,
              private router: Router,
              private matDialog: MatDialog,
              private ref: ChangeDetectorRef,
              private toastr: ToastrService) { }

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

    this.getListaProductosRefresh();
  }

  private getListaProductosRefresh(){

    this.isLoading = !this.isLoading;

    let dialogRef = this.loadingService.open();

    this.coreService.getListProductosByIdEmp(this.idEmpresa, this.tokenValidate, this.nombreBd).subscribe({
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
        minWidth: '0',
        width: '400px',
        data: {
          title: 'Va a eliminar el producto, desea continuar?',
          header: 'Eliminar Producto'}
      });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteProductoApi(idProducto);
      }
    });
  }

  private deleteProductoApi(idProducto: any): void{
    let dialogRef = this.loadingService.open();

    this.coreService.deleteProductoByIdEmp(idProducto, this.idEmpresa, this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {
        dialogRef.close();

        if(data.isSucess){
          this.getListaProductosRefresh();
        }else{
          if(data.tieneMovimientos){
            this.toastr.error('No se puede eliminar, presenta movimientos', '', {
              timeOut: 3000,
              closeButton: true
            });
          }
        }

      },
      error: (error: any) => {
        dialogRef.close();
      }
    });
    
  }

  searchProductosText(): void{

    this.isLoading = !this.isLoading;

    let dialogRef = this.loadingService.open();

    this.coreService.searchProductosByIdEmpText(this.idEmpresa, this.textSearchProductos, this.tokenValidate, this.nombreBd).subscribe({
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

  exportarProductos(){
    let dialogRef = this.loadingService.open();

    this.coreService.getExcelListProductos(this.idEmpresa, this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {

        dialogRef.close();

        let downloadUrl = window.URL.createObjectURL(data);

        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', downloadUrl);
        link.setAttribute('download','productos');
        document.body.appendChild(link);
        link.click();
        link.remove();

      },
      error: (error: any) => {
        dialogRef.close();
        console.log('inside error');
        console.log(error);
      }
    });
  }
  

  onFileChange(file: any){
    if(file.length === 0){
      return;
    }

    /*let nameFile = file[0].name;
    const mimeType = file[0].type;*/

    this.file = file[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file!!);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
    
      let workBook = XLSX.read(this.arrayBuffer, {type: "binary", cellDates: true});
      let first_sheet_name = workBook.SheetNames[0];
      let worksheet = workBook.Sheets[first_sheet_name];

      let arraylist = XLSX.utils.sheet_to_json(worksheet,{raw:true});

      let listProductosMap : Producto[] = [];
      arraylist.forEach((item: any) => {
        if(item['codigo'] == undefined || item['nombre'] == undefined || 
          item['pvp'] == undefined || isNaN(item['pvp']) ||
          item['stock'] == undefined || isNaN(item['stock']) ||
          item['iva'] == undefined || isNaN(item['iva'])){
          return;
        }

        let ivaSiNo = "0";
        let valorIva = Number(item['iva']).toFixed(0);
        if(parseInt(valorIva) == 12){
          ivaSiNo = "1"
        }

        let productoOtro = {
          prod_id: 0, 
          prod_empresa_id: this.idEmpresa, 
          prod_codigo: item['codigo'], 
          prod_codigo_barras: '',
          prod_nombre: item['nombre'],
          prod_costo: '', 
          prod_utilidad: '', 
          prod_pvp: item['pvp'], 
          prod_iva_si_no: ivaSiNo,
          prod_stock: item['stock'], 
          prod_unidad_medida: item['unidad_medida'] ? item['unidad_medida'] : '', 
          prod_observaciones: '', 
          pro_categoria: item['categoria'] ? item['categoria'] : '' ,
          prod_marca: item['marca'] ? item['marca'] : '', 
          prod_activo_si_no: "1",
        }
        listProductosMap.push(productoOtro);
      });

      if(listProductosMap.length <= 0) { 

        this.toastr.error('No se encontraron productos, verifique el formato', '', {
          enableHtml: true,
          closeButton: true,
          timeOut: 5000,
          extendedTimeOut: 5000
        });
        return;
      }
      
      const dialogRef = this.matDialog.open(ImportarProductosDialogComponent, {
        minWidth: '0',
        width: '80%',
        panelClass: 'my-import-cliente-dialog',
        data: {
          listProductos: listProductosMap
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('inside close dialog result');
      });

    }
  }

  private setCeroInLeft(valor: string): string{
    return '0' + valor;
  }


  getTemplateProductosExcel(){
    let dialogRef = this.loadingService.open();

    this.coreService.getTemplateProductosExcel(this.idEmpresa, this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {
        dialogRef.close();

        let downloadUrl = window.URL.createObjectURL(data);

        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', downloadUrl);
        link.setAttribute('download','plantilla_productos');
        document.body.appendChild(link);
        link.click();
        link.remove();

      },
      error: (error: any) => {
        dialogRef.close();
        console.log('inside error');
        console.log(error);
      }
    });
  }

}
