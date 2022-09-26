import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente } from 'src/app/interfaces/Cliente';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-buscar-cliente-dialog',
  templateUrl: './buscar-cliente-dialog.component.html',
  styleUrls: ['./buscar-cliente-dialog.component.css']
})
export class BuscarClienteDialogComponent implements OnInit {

  displayedColumns: string[] = ['ci', 'nombre', 'direccion'];
  datasource = new MatTableDataSource<Cliente>();
  
  idEmpresa: number = 0;
  rucEmpresa: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  listaClientes: Cliente[] = [];
  textSearchClientes: string = '';
  showSinDatos = false;
  
  constructor(private coreService: ApplicationProvider,
    private localService: LocalService,
    public matDialogRef: MatDialogRef<BuscarClienteDialogComponent>,
    private loadingService: LoadingService,
    private ref: ChangeDetectorRef) { }

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

    this.getListaClientesRefresh();
  }


  private getListaClientesRefresh(){

    this.coreService.getListClientesByIdEmp(this.idEmpresa, this.tokenValidate).subscribe({
      next: (data: any) => {

        this.listaClientes = data.data;
        this.datasource.data = this.listaClientes;
      },
      error: (error) => {

      }
    });

  }

  clickSelectItem(dataCliente: any){

    this.matDialogRef.close(dataCliente);
  }


  searchClientesText(): void{

    let dialogRef = this.loadingService.open();

    this.coreService.searchClientesByIdEmpText(this.idEmpresa, this.textSearchClientes, this.tokenValidate).subscribe({
      next: (data: any) => {
        
        dialogRef.close();

        this.listaClientes = data.data;

        if(this.listaClientes.length > 0){
          this.showSinDatos = false
        }else{
          this.showSinDatos = true;
        }

        this.datasource.data = this.listaClientes;
        this.ref.detectChanges();

      },
      error: (error: any) => {
        dialogRef.close();
        this.showSinDatos = !this.showSinDatos;
      }
    });
  }

  nuevoClienteClick(){
    const response = {
      redirectNewClient: true,
      data: this.textSearchClientes
    }
    this.matDialogRef.close(response);
  }
}
