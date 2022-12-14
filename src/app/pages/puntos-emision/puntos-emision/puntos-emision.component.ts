import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDeleteDialogComponent } from 'src/app/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/application/application';
import { LoadingService } from 'src/app/services/Loading.service';
import { Establecimiento } from '../models/Establecimiento';

@Component({
  selector: 'app-puntos-emision',
  templateUrl: './puntos-emision.component.html',
  styleUrls: ['./puntos-emision.component.css']
})
export class PuntosEmisionComponent implements OnInit {

  displayedColumns: string[] = ['establecimiento', 'nombreEmpresa', 'direccion', 'telefono', 'actions'];
  datasource = new MatTableDataSource<Establecimiento>();
  
  showSinDatos = true;

  idEmpresa: number = 0;
  rucEmpresa: string = '';
  nombreBd: string = '';

  empresaData: any;

  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;
  
  constructor(private coreService: ApplicationProvider,
    public router: Router,
    private loadingService: LoadingService,
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
    this.nombreBd = localServiceResponseUsr._nombreBd;

    this.getListEstablecimientos();
  }

  clickNuevoEstabl(){
    this.router.navigate(['establecimientos/nuevo']);
  }


  getListEstablecimientos(){

    let dialog = this.loadingService.open();
    this.coreService.getEstablecimientosByIdEmp(this.idEmpresa, this.nombreBd, this.tokenValidate).subscribe({
      next: (data: any) =>{
        dialog.close();

        this.datasource.data = data.data;
        this.showSinDatos =  this.datasource.data.length <= 0
      },
      error: (error: any) =>{
        dialog.close();
        console.log('inside error list');
        console.log(error);
      }
    });
  }

  editarEstablecimiento(idEstablecimiento: number, numeroEstablecimiento: string){
    this.router.navigate(['establecimientos/editar', idEstablecimiento], {state: {'numeroEstablecimiento': numeroEstablecimiento}});
  }

  eliminarClick(idEstablecimiento: number): void{

    console.log(idEstablecimiento);
    const dialogRef = this.matDialog.open(ConfirmDeleteDialogComponent, {        
        
        minWidth: '0',
        width: '400px',
        data: {
          title: 'Va a eliminar el establecimiento, desea continuar?',
          header: 'Eliminar Establecimiento'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteEstablecimientoApi(idEstablecimiento);
      }
    });
  }

  private deleteEstablecimientoApi(idEstablecimiento: any): void{
    let dialogRef = this.loadingService.open();

    this.coreService.deleteEstablecimientoById(this.idEmpresa, idEstablecimiento,this.nombreBd,  this.tokenValidate).subscribe({
      next: (data: any) => {
        dialogRef.close();
        if(data.isSucess){
          this.getListEstablecimientos();
        }else{
          if(data.tieneMovimientos){
            this.toastr.error('No se puede eliminar el establecimiento, reintente', '', {
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
}
