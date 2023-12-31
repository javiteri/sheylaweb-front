import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Cliente } from 'src/app/interfaces/Cliente';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';

@Component({
  selector: 'app-buscar-cliente-dialog',
  templateUrl: './buscar-cliente-dialog.component.html',
  styleUrls: ['./buscar-cliente-dialog.component.css']
})
export class BuscarClienteDialogComponent implements OnInit {

  boxSearchInput! : ElementRef<HTMLInputElement>;
  @ViewChild('boxSearchInput') set inputElRef(elRef: ElementRef<HTMLInputElement>){
    if(elRef){
      this.boxSearchInput = elRef;
    }
  }

  displayedColumns: string[] = ['ci', 'nombre', 'direccion'];
  datasource = new MatTableDataSource<Cliente>();
  
  idEmpresa: number = 0;
  rucEmpresa: string = '';
  nombreBd: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  listaClientes: Cliente[] = [];
  textSearchClientes: string = '';
  showSinDatos = false;

  timeoutId?: number = undefined;

  constructor(private coreService: ApplicationProvider,
    public matDialogRef: MatDialogRef<BuscarClienteDialogComponent>,
    private loadingService: LoadingService,
    private ref: ChangeDetectorRef) { }


  ngAfterViewInit(): void {
    setTimeout(() =>{
      this.boxSearchInput.nativeElement.focus();
      this.ref.detectChanges();
    }, 200);
  }

  ngOnInit(): void {
    //this.matDialogRef.disableClose = true;

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

    this.getListaClientesRefresh();
  }


  private getListaClientesRefresh(){

    this.coreService.getListClientesByIdEmp(this.idEmpresa, this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {

        this.listaClientes = data.data;
        this.datasource.data = this.listaClientes;
      },
      error: (error) => {}
    });

  }

  clickSelectItem(dataCliente: any){

    this.matDialogRef.close(dataCliente);
  }


  searchClientesText(): void{
    clearTimeout(this.timeoutId);
    this.timeoutId = window.setTimeout(() => {
      this.callSearchApi();
    }, 500);
  }

  private callSearchApi(){
    let dialogRef = this.loadingService.open();

    this.coreService.searchClientesByIdEmpText(this.idEmpresa, this.textSearchClientes, this.tokenValidate, this.nombreBd).subscribe({
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

  clearText(){
    if(this.textSearchClientes != ""){
      this.textSearchClientes = "";
      this.searchClientesText();

      this.boxSearchInput.nativeElement.focus();
      this.ref.detectChanges();
    }
  }
}
