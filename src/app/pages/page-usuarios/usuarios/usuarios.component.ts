import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
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
              private ref: ChangeDetectorRef) { 
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

    this.getListUsuariosRefresh();

  }


  nuevoUsuario(){
    this.router.navigate(['/usuarios/nuevo']);
  }

  private getListUsuariosRefresh(): void {
    this.isLoading = !this.isLoading

    let dialogRef = this.loadingService.open();

    this.coreService.getUsuariosByIdEmp(this.idEmpresa, this.tokenValidate).subscribe({
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
        width: '250px',
        data: {title: 'Va a eliminar el cliente, desea continuar?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteUserBD(idUser);
      }
    });
  }


  private deleteUserBD(idUser: any): void{
    let dialogRef = this.loadingService.open();

    this.coreService.deleteUsuarioByIdEmp(idUser, this.idEmpresa, this.tokenValidate).subscribe({
      next: (data: any) => {
        dialogRef.close();
        this.getListUsuariosRefresh();
      },
      error: (error: any) => {
        dialogRef.close();
      }
    });
    
  }


  searchUsuariosText(): void{

    this.isLoading = !this.isLoading;

    let dialogRef = this.loadingService.open();

    this.coreService.searchUsuariosByIdEmpText(this.idEmpresa, this.textSearchUsuarios, this.tokenValidate).subscribe({
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

}
