import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';
import { ItemListaProforma } from '../models/ItemListaProforma';

@Component({
  selector: 'app-lista-proformas',
  templateUrl: './lista-proformas.component.html',
  styleUrls: ['./lista-proformas.component.css']
})
export class ListaProformasComponent implements OnInit {

  displayedColumns: string[] = ['fecha hora', 'numero', 'total', 'usuario', 'cliente', 'identificacion', 'forma pago','actions'];
  datasource = new MatTableDataSource<ItemListaProforma>();

  listaProformas: any[] = [];

  idEmpresa: number = 0;
  rucEmpresa: string = '';
  nombreBd: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  showPagination = false;
  showSinDatos = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dateInicioFilter = new Date();
  dateFinFilter = new Date();

  noDocmento = "";
  nombreCiRuc = "";
  
  textSearchClientes: string = '';

  constructor(
    private loadingService: LoadingService,
    private coreService: ApplicationProvider,
    private ref: ChangeDetectorRef
  ) { }

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

    this.getListProformasByIdEmpresa();
  }


  private getListProformasByIdEmpresa(){

    let dialogRef = this.loadingService.open();

    this.coreService.getListProformasByIdEmp(this.idEmpresa, this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) =>{
        dialogRef.close();
        console.log('dentro de succes en lista de profromas');
        console.log(data);

        this.listaProformas = data.data;

        if(this.listaProformas.length > 0){
          this.showPagination = true;//!this.showPagination;
          this.showSinDatos = false
        }else{
          this.showSinDatos = !this.showSinDatos;
          this.showPagination = false
        }

        this.datasource.data = this.listaProformas;
        this.ref.detectChanges();
        this.datasource.paginator = this.paginator;
        
      },
      error: (data: any) =>{
        dialogRef.close();
        console.log('dentro de error obteniendo lista de proformas');
        console.log(data);

        this.showSinDatos = !this.showSinDatos;
      }
    });

  }

}
