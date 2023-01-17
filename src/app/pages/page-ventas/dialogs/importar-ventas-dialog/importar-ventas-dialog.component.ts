import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';
import { VentaImport } from '../../models/VentaImport';


export interface DialogData {
  listVentas: VentaImport[];
}

@Component({
  selector: 'app-importar-ventas-dialog',
  templateUrl: './importar-ventas-dialog.component.html',
  styleUrls: ['./importar-ventas-dialog.component.css']
})
export class ImportarVentasDialogComponent implements OnInit {

  displayedColumns: string[] = ['fecha hora', 'documento', 'numero', 'total', 'cliente', 'identificacion', 'forma pago','actions'];
  datasource = new MatTableDataSource<VentaImport>();

  idEmpresa: number = 0;
  rucEmpresa: string = '';
  nombreBd: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  listaVentas: VentaImport[] = [];
  showSinDatos = false;
  showPagination = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private coreService: ApplicationProvider,
    private toastr: ToastrService,
    public matDialogRef: MatDialogRef<ImportarVentasDialogComponent>,
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

    this.listaVentas = this.dialogData['listVentas'];
    this.setDataInTable();

  }

  private setDataInTable(){
    if(this.listaVentas.length > 0){
      this.showPagination = true;
      this.showSinDatos = false
    }else{
      this.showSinDatos = true;
      this.showPagination = false
    }

    this.datasource.data = this.listaVentas;
    this.ref.detectChanges();
    this.datasource.paginator = this.paginator;
  }

  eliminarClick(index: number){
    let indexInList = this.paginator.pageIndex == 0 ? index + 1 : 1 + index + this.paginator.pageIndex * this.paginator.pageSize

    this.datasource.data.splice(indexInList - 1, 1);
    this.datasource._updateChangeSubscription();
    this.datasource.paginator = this.paginator;
  }
  
  guardarVentas(){
    if(this.listaVentas.length <= 0){
      return;
    }

    const postData = {
      listVentas: this.datasource.data,
      nombreBd: this.nombreBd,
      idEmp: this.idEmpresa
    }
    
    let dialogRef = this.loadingService.open();

    this.coreService.importListVentas(postData, this.tokenValidate).subscribe({
      next: (data: any) => {
        dialogRef.close();
        if(data.listVentasWithError.length > 0){

          this.toastr.success('Datos importados, con errores', '', {
            timeOut: 5000,
            closeButton: true
          });

          this.listaVentas.splice(0, this.listaVentas.length)
          this.listaVentas = data.listVentasWithError;
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

        this.toastr.error('Error importando ventas, reintente', '', {
          timeOut: 5000,
          closeButton: true
        });

      }
    });
  }
}
