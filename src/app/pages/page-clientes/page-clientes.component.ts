import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDeleteDialogComponent } from 'src/app/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/application/application';
import { LoadingService } from 'src/app/services/Loading.service';
import {Cliente} from '../../interfaces/Cliente'

@Component({
  selector: 'app-page-clientes',
  templateUrl: './page-clientes.component.html',
  styleUrls: ['./page-clientes.component.css']
})
export class PageClientesComponent implements OnInit {

  displayedColumns: string[] = ['ci', 'nombre', 'email', 'tipo', 'telefono', 'nacionalidad', 'actions'];
  datasource = new MatTableDataSource<Cliente>();

  showPagination = false;
  showSinDatos = false;
  isLoading = false;
  listaClientes: Cliente[] = [];

  idEmpresa: number = 0;
  rucEmpresa: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  textSearchClientes: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private coreService: ApplicationProvider ,
              private ref: ChangeDetectorRef,
              private loadingService: LoadingService,
              private router: Router,
              private matDialog: MatDialog,
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

      this.getListaClientesRefresh();      

  }


  private getListaClientesRefresh(){

    this.isLoading = !this.isLoading;

    let dialogRef = this.loadingService.open();

    this.coreService.getListClientesByIdEmp(this.idEmpresa, this.tokenValidate).subscribe({
      next: (data: any) => {

        dialogRef.close();

        this.isLoading = !this.isLoading;

        this.listaClientes = data.data;

        if(this.listaClientes.length > 0){
          this.showPagination = true;//!this.showPagination;
          this.showSinDatos = false
        }else{
          this.showSinDatos = !this.showSinDatos;
          this.showPagination = false
        }

        this.datasource.data = this.listaClientes;
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

  nuevoCliente(){
    this.router.navigate(['/clientes/nuevo']);
  }


  scrollUp(): void{
    //setTimeout( () => this.tableInput.nativeElement.scrollIntoView({behavior: 'smooth', clock: 'end'}));
  }

  editarClick(idCli: any){

    this.router.navigate(['/clientes/editar', idCli]);
  }

  eliminarClick(idCliente: any): void{
    
    const dialogRef = this.matDialog.open(ConfirmDeleteDialogComponent, {
        width: '250px',
        data: {title: 'Va a eliminar el cliente, desea continuar?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteClienteApi(idCliente);
      }
    });
  }

  private deleteClienteApi(idCliente: any): void{
    let dialogRef = this.loadingService.open();

    this.coreService.deleteClienteByIdEmp(idCliente, this.idEmpresa, this.tokenValidate).subscribe({
      next: (data: any) => {
        dialogRef.close();
        if(data.isSucess){
          this.getListaClientesRefresh();
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
        console.log(error);
        dialogRef.close();
      }
    });
    
  }

  searchClientesText(): void{

    this.isLoading = !this.isLoading;

    let dialogRef = this.loadingService.open();

    this.coreService.searchClientesByIdEmpText(this.idEmpresa, this.textSearchClientes, this.tokenValidate).subscribe({
      next: (data: any) => {
        dialogRef.close();
        this.isLoading = !this.isLoading;

        this.listaClientes = data.data;

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

      },
      error: (error: any) => {
        dialogRef.close();

        this.isLoading = !this.isLoading;
        this.showSinDatos = !this.showSinDatos;
      }
    });
  }


  exportarClientes(){
    let dialogRef = this.loadingService.open();

    this.coreService.getExcelListClientes(this.idEmpresa, this.tokenValidate).subscribe({
      next: (data: any) => {

        dialogRef.close();

        let downloadUrl = window.URL.createObjectURL(data);

        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', downloadUrl);
        link.setAttribute('download','clientes');
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
