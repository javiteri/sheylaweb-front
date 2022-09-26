import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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
      this.noDocmento, dateInitString, dateFinString,this.tokenValidate).subscribe({
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
      width: '250px',
      data: {title: 'Va a Eliminar la Compra, desea continuar?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
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

    });

  }

  private getConfigNumDecimalesIdEmp(){
    this.coreService.getConfigByNameIdEmp(this.idEmpresa,'COMPRA_NUMERODECIMALES', this.tokenValidate).subscribe({
      next: (data: any) => {

        if(data.data){
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
    console.log(compra);
    this.router.navigate(['/compras/crearcompra', compra.id]); 
  }
}
