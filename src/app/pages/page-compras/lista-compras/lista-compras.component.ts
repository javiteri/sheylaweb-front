import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';
import { ItemListaCompra } from '../models/ItemListaCompra';

@Component({
  selector: 'app-lista-compras',
  templateUrl: './lista-compras.component.html',
  styleUrls: ['./lista-compras.component.css']
})
export class ListaComprasComponent implements OnInit {

  displayedColumns: string[] = ['fecha hora', 'documento', 'numero', 'total', 'usuario', 'proveedor', 'identificacion', 'forma pago','actions'];
  datasource = new MatTableDataSource<ItemListaCompra>();
  
  idEmpresa: number = 0;
  rucEmpresa: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  showPagination = false;
  showSinDatos = false;

  dateInicioFilter = new Date();
  dateFinFilter = new Date();

  noDocmento = "";
  nombreCiRuc = "";

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private coreService: ApplicationProvider,
    private loadingService: LoadingService,
    private ref: ChangeDetectorRef) { }

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

    this.searchListaComprasWithFilter();
  }


  searchListaComprasWithFilter(){

    let dialogRef = this.loadingService.open();
    
    if(!(this.dateInicioFilter && this.dateFinFilter)){
      dialogRef.close();
      return;
    }

    const dateInitString = '' + this.dateInicioFilter.getFullYear() + '-' + ('0' + (this.dateInicioFilter.getMonth()+1)).slice(-2) + 
                          '-' + ('0' + this.dateInicioFilter.getDate()).slice(-2) + ' ' + 
                            '00:00:00' ;
    const dateFinString = '' + this.dateFinFilter.getFullYear() + '-' + ('0' + (this.dateFinFilter.getMonth()+1)).slice(-2) + 
                            '-' + ('0' + this.dateFinFilter.getDate()).slice(-2) + ' ' + 
                              '23:59:59' ;

    this.coreService.getListaComprasByIdEmp(this.idEmpresa, this.nombreCiRuc, 
      this.noDocmento, dateInitString, dateFinString,this.tokenValidate).subscribe({
      next: (results: any) => {
        dialogRef.close();

        try{
          this.showPagination = results.data.length > 0;
          this.showSinDatos = !(results.data.length > 0);
        }catch(error){
          this.showPagination = false;
        }

        this.datasource.data = results.data;
        this.ref.detectChanges();
        this.datasource.paginator = this.paginator;
      },
      error: (error) => {
        dialogRef.close();
      }
    });
  }

  deleteCompraByIdEmp(idCompra: any, tipoDoc: any){
    let dialogRef = this.loadingService.open();

    this.coreService.deleteCompraByIdEmp(this.idEmpresa,idCompra,tipoDoc, this.tokenValidate).subscribe({
      next: (results: any) => {
        dialogRef.close();
        this.searchListaComprasWithFilter();
      },
      error: (error) => {
        dialogRef.close();
      }
    });
  }
}