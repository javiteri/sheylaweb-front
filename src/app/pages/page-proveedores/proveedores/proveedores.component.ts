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
        minWidth: '0',
        width: '400px',
        data: {
          title: 'Va a eliminar el proveedor, desea continuar?',
          header: 'Eliminar Proveedor'
        }
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

        if(data.isSucess){
          this.getListaProveedoresRefresh();
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


  exportarProveedores(){
    let dialogRef = this.loadingService.open();

    this.coreService.getExcelListProveedores(this.idEmpresa, this.tokenValidate).subscribe({
      next: (data: any) => {

        dialogRef.close();

        let downloadUrl = window.URL.createObjectURL(data);

        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', downloadUrl);
        link.setAttribute('download','proveedores');
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
