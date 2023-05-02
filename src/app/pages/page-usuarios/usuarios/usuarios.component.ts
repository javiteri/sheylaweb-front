import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDeleteDialogComponent } from 'src/app/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { Usuario } from 'src/app/interfaces/Usuario';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  displayedColumns: string[] = ['identificacion','nombre', 'telefono', 'email', 'username', 'actions'];
  datasource = new MatTableDataSource<Usuario>();

  showPagination = false;
  showSinDatos = false;
  isLoading = false;
  listaUsuarios: Usuario[] = [];

  idEmpresa: number = 0;
  rucEmpresa: string = '';
  idUsuario: number = 0;
  nombreBd: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  textSearchUsuarios: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('containerTable', {read: ElementRef}) tableInput!: ElementRef

  constructor(private coreService: ApplicationProvider, 
              private router: Router,
              private loadingService: LoadingService,
              private matDialog: MatDialog,
              private ref: ChangeDetectorRef,
              private toastr: ToastrService) { 
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
    this.idUsuario = localServiceResponseUsr._userId;
    this.nombreBd = localServiceResponseUsr._nombreBd;

    this.getListUsuariosRefresh();

  }


  nuevoUsuario(){
    this.router.navigate(['/usuarios/nuevo']);
  }

  private getListUsuariosRefresh(): void {
    this.isLoading = !this.isLoading

    let dialogRef = this.loadingService.open();

    this.coreService.getUsuariosByIdEmp(this.idEmpresa, this.tokenValidate, this.nombreBd).subscribe({
      next: (dataUsers: any) => {
        dialogRef.close();

        this.isLoading = !this.isLoading;
        this.listaUsuarios = dataUsers.data;

        if(this.listaUsuarios.length > 0){
          this.showPagination = true;
          this.showSinDatos = false
        }else{
          this.showSinDatos = !this.showSinDatos;
          this.showPagination = false
        }

        this.datasource.data = this.listaUsuarios;
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


  editarClick(idUser: any){ 
    this.router.navigate(['/usuarios/editar', idUser]);
  }

  eliminarClick(idUser: any): void{
    const dialogRef = this.matDialog.open(ConfirmDeleteDialogComponent, {
        minWidth: '0',
        width: '400px',
        data: {
          title: 'Va a eliminar el Usuario, desea continuar?',
          header: 'Eliminar Usuario'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteUserBD(idUser);
      }
    });
  }


  private deleteUserBD(idUser: any): void{
    let dialogRef = this.loadingService.open();

    this.coreService.deleteUsuarioByIdEmp(idUser, this.idEmpresa, this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {
        dialogRef.close();
        if(data.isSucess){
          this.getListUsuariosRefresh();
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


  searchUsuariosText(): void{

    this.isLoading = !this.isLoading;

    let dialogRef = this.loadingService.open();

    this.coreService.searchUsuariosByIdEmpText(this.idEmpresa, this.textSearchUsuarios, this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {

        dialogRef.close();
        this.isLoading = !this.isLoading;

        this.listaUsuarios = data.data;

        if(this.listaUsuarios.length > 0){
          this.showPagination = true;
          this.showSinDatos = false
        }else{
          this.showSinDatos = true;
          this.showPagination = false
        }

        this.datasource.data = this.listaUsuarios;
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

  exportarUsuarios(){
    let dialogRef = this.loadingService.open();

    this.coreService.getExcelListUsuarios(this.idEmpresa, this.tokenValidate,this.nombreBd).subscribe({
      next: (data: any) => {

        dialogRef.close();

        let downloadUrl = window.URL.createObjectURL(data);

        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', downloadUrl);
        link.setAttribute('download','usuarios');
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
