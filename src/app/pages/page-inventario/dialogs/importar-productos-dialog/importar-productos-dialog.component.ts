import { ChangeDetectorRef, Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { Producto } from 'src/app/interfaces/Productos';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';

export interface DialogData {
  listProductos: Producto[];
}

@Component({
  selector: 'app-importar-productos-dialog',
  templateUrl: './importar-productos-dialog.component.html',
  styleUrls: ['./importar-productos-dialog.component.css']
})
export class ImportarProductosDialogComponent implements OnInit {

  displayedColumns: string[] = ['codigo','nombre', 'stock', 'unidadMedida', 'categoria', 'marca','actions'];
  datasource = new MatTableDataSource<Producto>();

  idEmpresa: number = 0;
  rucEmpresa: string = '';
  nombreBd: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  listaProductos: Producto[] = [];
  showSinDatos = false;
  showPagination = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(
    private coreService: ApplicationProvider,
    private toastr: ToastrService,
    public matDialogRef: MatDialogRef<ImportarProductosDialogComponent>,
    private loadingService: LoadingService,
    private ref: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData
  ) { }

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
    this.nombreBd = localServiceResponseUsr._nombreBd;

    this.listaProductos = this.dialogData['listProductos'];
    this.setDataInTable();

  }


  private setDataInTable(){
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
  }

  eliminarClick(index: number){
    let indexInList = this.paginator.pageIndex == 0 ? index + 1 : 1 + index + this.paginator.pageIndex * this.paginator.pageSize

    this.datasource.data.splice(indexInList - 1, 1);
    this.datasource._updateChangeSubscription();
    this.datasource.paginator = this.paginator;
  }

  guardarProductos(){
    if(this.listaProductos.length <= 0){
      return;
    }

    const postData = {
      listProductos: this.datasource.data,
      nombreBd: this.nombreBd,
      idEmp: this.idEmpresa
    }
    
    let dialogRef = this.loadingService.open();

    this.coreService.importListProductos(postData, this.tokenValidate).subscribe({
      next: (data: any) => {
        console.log(data);
        dialogRef.close();
        if(data.listProductosWithError.length > 0){

          this.toastr.success('Datos importados, con errores', '', {
            timeOut: 3000,
            closeButton: true
          });

          this.listaProductos.splice(0, this.listaProductos.length)
          this.listaProductos = data.listProductosWithError;
          this.setDataInTable();

        }else{
          this.toastr.success('Datos importados, correctamente', '', {
            timeOut: 3000,
            closeButton: true
          });

          this.matDialogRef.close();
        }
      },
      error: (error: any) => {
        dialogRef.close();

        this.toastr.error('Error importando productos, reintente', '', {
          timeOut: 3000,
          closeButton: true
        });

      }
    })
  }
}
