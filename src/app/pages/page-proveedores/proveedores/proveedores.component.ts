import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDeleteDialogComponent } from 'src/app/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { Proveedor } from 'src/app/interfaces/Proveedor';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {

  displayedColumns: string[] = ['ci', 'nombre', 'email', 'telefono', 'observacion', 'actions'];
  datasource = new MatTableDataSource<Proveedor>();

  showPagination = false;
  showSinDatos = false;
  isLoading = false;
  listaProveedores: Proveedor[] = [];

  idEmpresa: number = 0;
  rucEmpresa: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  textSearchProveedores: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('containerTable', {read: ElementRef}) tableInput!: ElementRef

  constructor(private coreService: ApplicationProvider,
              private localService: LocalService,
              private loadingService: LoadingService,
              private router: Router,
              private toastr: ToastrService,
              private matDialog: MatDialog,
              private ref: ChangeDetectorRef) { }


  ngOnInit(): void {

    // GET INITIAL DATA 
    const localServiceResponseToken = this.localService.storageGetJsonValue('DATA_TOK');
    const localServiceResponseUsr = this.localService.storageGetJsonValue('DATA_USER');

    this.dataUser = localServiceResponseToken;
    const { token, expire } = this.dataUser;
    this.tokenValidate = { token, expire};

    this.idEmpresa = localServiceResponseUsr._bussId;
    this.rucEmpresa = localServiceResponseUsr._ruc;

    this.getListaProveedoresRefresh();

  }

  private getListaProveedoresRefresh(){

    this.isLoading = !this.isLoading;

    let dialogRef = this.loadingService.open();

    this.coreService.getListProveedoresByIdEmp(this.idEmpresa, this.tokenValidate).subscribe({
      next: (data: any) => {

        dialogRef.close();

        this.isLoading = !this.isLoading;

        this.listaProveedores = data.data;

        if(this.listaProveedores.length > 0){
          this.showPagination = true;//!this.showPagination;
          this.showSinDatos = false
        }else{
          this.showSinDatos = !this.showSinDatos;
          this.showPagination = false
        }

        this.datasource.data = this.listaProveedores;
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

  nuevoProveedor(){
    this.router.navigate(['proveedores/nuevo']);
  }

  editarClick(idProv: any){
    this.router.navigate(['proveedores/editar', idProv]);
  }
  eliminarClick(idProv: any){
      const dialogRef = this.matDialog.open(ConfirmDeleteDialogComponent, {
        width: '250px',
        data: {title: 'Va a eliminar el proveedor, desea continuar?'}
      });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteProveedorApi(idProv);
      }
    });
  }

  private deleteProveedorApi(idProveedor: any): void{
    let dialogRef = this.loadingService.open();

    this.coreService.deleteProveedorByIdEmp(idProveedor, this.idEmpresa, this.tokenValidate).subscribe({
      next: (data: any) => {
        dialogRef.close();
        this.getListaProveedoresRefresh();
      },
      error: (error: any) => {
        dialogRef.close();
      }
    });
    
  }



  searchProveedoresText(): void{

    this.isLoading = !this.isLoading;

    let dialogRef = this.loadingService.open();

    this.coreService.searchProveedoresByIdEmpText(this.idEmpresa, this.textSearchProveedores, this.tokenValidate).subscribe({
      next: (data: any) => {
        
        dialogRef.close();
        this.isLoading = !this.isLoading;

        this.listaProveedores = data.data;

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

      },
      error: (error: any) => {
        dialogRef.close();

        this.isLoading = !this.isLoading;
        this.showSinDatos = !this.showSinDatos;
      }
    });
  }

}
