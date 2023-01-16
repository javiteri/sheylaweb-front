import { ChangeDetectorRef, Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/interfaces/Cliente';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';
import { CustomPaginator } from '../../CustomPaginator';


export interface DialogData {
  listClientes: Cliente[];
}


@Component({
  selector: 'app-importar-clientes-dialog',
  templateUrl: './importar-clientes-dialog.component.html',
  styleUrls: ['./importar-clientes-dialog.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }  // Here
  ]
})
export class ImportarClientesDialogComponent implements OnInit {

  displayedColumns: string[] = ['ci', 'nombre', 'email', 'tipo', 'telefono', 'actions'];
  datasource = new MatTableDataSource<Cliente>();

  idEmpresa: number = 0;
  rucEmpresa: string = '';
  nombreBd: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  listaClientes: Cliente[] = [];
  showSinDatos = false;
  showPagination = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private coreService: ApplicationProvider,
    private toastr: ToastrService,
    public matDialogRef: MatDialogRef<ImportarClientesDialogComponent>,
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

    this.listaClientes = this.dialogData['listClientes'];
    this.setDataInTable();
  }

  private setDataInTable(){
    if(this.listaClientes.length > 0){
      this.showPagination = true;
      this.showSinDatos = false
    }else{
      this.showSinDatos = true;
      this.showPagination = false
    }

    this.datasource.data = this.listaClientes;
    this.ref.detectChanges();
    this.datasource.paginator = this.paginator;
  }


  eliminarClick(index: number){
    let indexInList = this.paginator.pageIndex == 0 ? index + 1 : 1 + index + this.paginator.pageIndex * this.paginator.pageSize

    this.datasource.data.splice(indexInList - 1, 1);
    this.datasource._updateChangeSubscription();
    this.datasource.paginator = this.paginator;
  }

  guardarClientes(){
    if(this.listaClientes.length <= 0){
      return;
    }

    const postData = {
      listClientes: this.datasource.data,
      nombreBd: this.nombreBd,
      idEmp: this.idEmpresa
    }
    
    let dialogRef = this.loadingService.open();

    this.coreService.importListClientes(postData, this.tokenValidate).subscribe({
      next: (data: any) => {
        dialogRef.close();
        if(data.listClientesWithError.length > 0){

          this.toastr.success('Datos importados, con errores', '', {
            timeOut: 5000,
            closeButton: true
          });

          this.listaClientes.splice(0, this.listaClientes.length)
          this.listaClientes = data.listClientesWithError;
          this.setDataInTable();

        }else{
          this.toastr.success('Datos importados, correctamente', '', {
            timeOut: 5000,
            closeButton: true
          });

          this.matDialogRef.close();
        }
      },
      error: (error: any) => {
        dialogRef.close();

        this.toastr.error('Error importando clientes, reintente', '', {
          timeOut: 5000,
          closeButton: true
        });

      }
    })
  }
}
