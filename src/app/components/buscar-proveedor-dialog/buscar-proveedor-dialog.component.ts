import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { Proveedor } from 'src/app/interfaces/Proveedor';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';

@Component({
  selector: 'app-buscar-proveedor-dialog',
  templateUrl: './buscar-proveedor-dialog.component.html',
  styleUrls: ['./buscar-proveedor-dialog.component.css']
})
export class BuscarProveedorDialogComponent implements OnInit {

  displayedColumns: string[] = ['ci', 'nombre', 'direccion'];
  datasource = new MatTableDataSource<Proveedor>();

  textSearchProveedores: string = '';
  idEmpresa: number = 0;
  rucEmpresa: string = '';
  nombreBd: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  listaProveedores: Proveedor[] = [];
  showSinDatos = false;

  constructor(private coreService: ApplicationProvider,
    private loadingService: LoadingService,
    public matDialogRef: MatDialogRef<BuscarProveedorDialogComponent>,
    private ref: ChangeDetectorRef) { }

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

    this.getListaProveedoresInit();

  }


  private getListaProveedoresInit(){

    this.coreService.getListProveedoresByIdEmp(this.idEmpresa, this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {

        this.listaProveedores = data.data;
        this.datasource.data = this.listaProveedores;
      },
      error: (error) => {

      }
    });

  }


  clickSelectItem(dataProveedor: any){
    this.matDialogRef.close(dataProveedor);
  }

  searchProveedoresText(): void{

    let dialogRef = this.loadingService.open();

    this.coreService.searchProveedoresByIdEmpText(this.idEmpresa, this.textSearchProveedores, this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {
        
        dialogRef.close();

        this.listaProveedores = data.data;

        if(this.listaProveedores.length > 0){
          this.showSinDatos = false
        }else{
          this.showSinDatos = true;
        }

        this.datasource.data = this.listaProveedores;
        this.ref.detectChanges();

      },
      error: (error: any) => {
        dialogRef.close();
        this.showSinDatos = !this.showSinDatos;
      }
    });
  }


}
