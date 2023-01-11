import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { Proveedor } from 'src/app/interfaces/Proveedor';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';

export interface DialogData {
  listProveedores: Proveedor[];
}

@Component({
  selector: 'app-importar-proveedores-dialog',
  templateUrl: './importar-proveedores-dialog.component.html',
  styleUrls: ['./importar-proveedores-dialog.component.css']
})
export class ImportarProveedoresDialogComponent implements OnInit {

  displayedColumns: string[] = ['ci', 'nombre', 'email', 'telefono', 'actions'];
  datasource = new MatTableDataSource<Proveedor>();

  idEmpresa: number = 0;
  rucEmpresa: string = '';
  nombreBd: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  listaProveedores: Proveedor[] = [];
  showSinDatos = false;
  showPagination = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private coreService: ApplicationProvider,
    private toastr: ToastrService,
    public matDialogRef: MatDialogRef<ImportarProveedoresDialogComponent>,
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

    this.listaProveedores = this.dialogData['listProveedores'];
    this.setDataInTable();

  }


  private setDataInTable(){
    if(this.listaProveedores.length > 0){
      this.showPagination = true;
      this.showSinDatos = false
    }else{
      this.showSinDatos = true;
      this.showPagination = false
    }

    this.datasource.data = this.listaProveedores;
    this.ref.detectChanges();
    this.datasource.paginator = this.paginator;
  }

  eliminarClick(index: number){
    let indexInList = this.paginator.pageIndex == 0 ? index + 1 : 1 + index + this.paginator.pageIndex * this.paginator.pageSize

    this.datasource.data.splice(indexInList - 1, 1);
    this.datasource._updateChangeSubscription();
    this.datasource.paginator = this.paginator;
  }

  guardarProveedores(){
    const postData = {
      listProveedores: this.datasource.data,
      nombreBd: this.nombreBd,
      idEmp: this.idEmpresa
    }
    
    let dialogRef = this.loadingService.open();

    this.coreService.importListProveedores(postData, this.tokenValidate).subscribe({
      next: (data: any) => {
        console.log('inside next data');
        console.log(data);
        dialogRef.close();
        if(data.listProveedoresWithError.length > 0){

          this.toastr.success('Datos importados, con errores', '', {
            timeOut: 3000,
            closeButton: true
          });

          this.listaProveedores.splice(0, this.listaProveedores.length)
          this.listaProveedores = data.listProveedoresWithError;
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
        console.log('inside error data');
        console.log(error);

        dialogRef.close();

        this.toastr.error('Error importando proveedores, reintente', '', {
          timeOut: 3000,
          closeButton: true
        });

      }
    })
  }

}
