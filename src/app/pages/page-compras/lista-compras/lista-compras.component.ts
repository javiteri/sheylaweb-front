import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Router } from '@angular/router';
import { ConfirmDeleteDialogComponent } from 'src/app/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';
import { ConfigReceive } from '../../configuraciones/models/ConfigReceive';
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
  nombreBd: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  showPagination = false;
  showSinDatos = false;

  dateInicioFilter = new Date();
  dateFinFilter = new Date();

  noDocmento = "";
  nombreCiRuc = "";

  fixedNumDecimal = 2;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private coreService: ApplicationProvider,
    private loadingService: LoadingService,
    private ref: ChangeDetectorRef,
    private router: Router,
    private matDialog: MatDialog) { }

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

    //this.searchListaComprasWithFilter();
    this.getConfigNumDecimalesIdEmp();
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
      this.noDocmento, dateInitString, dateFinString,this.tokenValidate, this.nombreBd).subscribe({
      next: (results: any) => {
        dialogRef.close();

        try{
          this.showPagination = results.data.length > 0;
          this.showSinDatos = !(results.data.length > 0);
        }catch(error){
          this.showPagination = false;
        }

        const arrayProducts: ItemListaCompra[] = results.data;
        const arrayWithDecimal = arrayProducts.map((itemListCompra: ItemListaCompra) => {
          itemListCompra.total = Number(itemListCompra.total).toFixed(this.fixedNumDecimal);
          return itemListCompra;
        });

        this.datasource.data = arrayWithDecimal;
        this.ref.detectChanges();

        /*this.datasource.data = results.data;
        this.ref.detectChanges();
        this.datasource.paginator = this.paginator;*/
      },
      error: (error) => {
        dialogRef.close();
      }
    });
  }

  deleteCompraByIdEmp(idCompra: any, tipoDoc: any){

    const dialogRef = this.matDialog.open(ConfirmDeleteDialogComponent, {
      minWidth: '0',
      width: '400px',
      data: {title: 'Va a Eliminar la Compra, desea continuar?',
            header: 'Eliminar Compra'
          }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        let dialogRef = this.loadingService.open();

      this.coreService.deleteCompraByIdEmp(this.idEmpresa,idCompra,tipoDoc, this.tokenValidate, this.nombreBd).subscribe({
        next: (results: any) => {
          dialogRef.close();
          this.searchListaComprasWithFilter();
        },
        error: (error) => {
          dialogRef.close();
        }
      });
      }

    });

  }

  private getConfigNumDecimalesIdEmp(){
    this.coreService.getConfigByNameIdEmp(this.idEmpresa,'COMPRA_NUMERODECIMALES', this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {

        if(data.data.length > 0){
          const configReceive: ConfigReceive = data.data[0];

          const splitValue = configReceive.con_valor.split('.');
          this.fixedNumDecimal = splitValue[1].length
        }


        this.searchListaComprasWithFilter();
      },
      error: (error) => {
        console.log('error get num decimales');
        console.log(error);
      }
    });
  }


  copiarCompraClick(compra: any): void{
    this.router.navigate(['/compras/crearcompra', compra.id]); 
  }


  exportarListaResumenCompras(){
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

    this.coreService.getExcelListaCompras(this.idEmpresa,this.nombreCiRuc,this.noDocmento,
                                        dateInitString,dateFinString, this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {

        dialogRef.close();

        let downloadUrl = window.URL.createObjectURL(data);

        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', downloadUrl);
        link.setAttribute('download','lista_compras');
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
