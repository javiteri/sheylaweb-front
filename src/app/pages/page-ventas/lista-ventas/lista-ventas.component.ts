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
import { ItemListaVenta } from '../models/ItemVentaModel';

@Component({
  selector: 'app-lista-ventas',
  templateUrl: './lista-ventas.component.html',
  styleUrls: ['./lista-ventas.component.css']
})
export class ListaVentasComponent implements OnInit {

  displayedColumns: string[] = ['fecha hora', 'documento', 'numero', 'total', 'usuario', 'cliente', 'identificacion', 'forma pago','actions'];
  datasource = new MatTableDataSource<ItemListaVenta>();

  idEmpresa: number = 0;
  rucEmpresa: string = '';
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

  fixedNumDecimal = 2;

  constructor(private coreService: ApplicationProvider,
    private loadingService: LoadingService,
    private ref: ChangeDetectorRef,
    private matDialog: MatDialog,
    private router: Router) { }

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
    
    //this.searchListaVentasWithFilter();
    this.getConfigNumDecimalesIdEmp();
  }


  searchListaVentasFilter(){
    this.searchListaVentasWithFilter();
  }

  private searchListaVentasWithFilter(){

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

    this.coreService.getListaVentasByIdEmp(this.idEmpresa, this.nombreCiRuc, 
      this.noDocmento, dateInitString, dateFinString,this.tokenValidate).subscribe({
      next: (results: any) => {
        dialogRef.close();

        try{
          this.showPagination = results.data.length > 0;
          this.showSinDatos = !(results.data.length > 0);
        }catch(error){
          this.showPagination = false;
        }


        const arrayProducts: ItemListaVenta[] = results.data;
        const arrayWithDecimal = arrayProducts.map((itemListVenta: ItemListaVenta) => {
          itemListVenta.total = Number(itemListVenta.total).toFixed(this.fixedNumDecimal);
          return itemListVenta;
        });

        this.datasource.data = arrayWithDecimal;
        this.ref.detectChanges();
      },
      error: (error) => {
        dialogRef.close();
      }
    });
  }

  updateEstadoAnulado(idVenta: any, estado: any){

    const dialogRef = this.matDialog.open(ConfirmDeleteDialogComponent, {
      width: '250px',
      data: {title: 'Va a Anular la Venta, desea continuar?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        
        let dialogReff = this.loadingService.open();

        this.coreService.updateEstadoVentaByIdEmp(this.idEmpresa,idVenta,estado, this.tokenValidate).subscribe({
          next: (results: any) => {
            dialogReff.close();
            this.searchListaVentasWithFilter();
          },
          error: (error) => {
            dialogReff.close();
            console.log('error en la actalizacion');
          }
        });

      }
    });

  }

  deleteVentaByIdEmp(idVenta: any, estado: any){

    const dialogRef = this.matDialog.open(ConfirmDeleteDialogComponent, {
      width: '250px',
      data: {title: 'Va a Eliminar la Venta, desea continuar?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        let dialogRef = this.loadingService.open();

        this.coreService.deleteVentaByIdEmp(this.idEmpresa,idVenta,estado, this.tokenValidate).subscribe({
          next: (results: any) => {
            dialogRef.close();
            this.searchListaVentasWithFilter();
          },
          error: (error) => {
            dialogRef.close();
          }
        });
      }

    });

  }

  private getConfigNumDecimalesIdEmp(){
    this.coreService.getConfigByNameIdEmp(this.idEmpresa,'VENTA_NUMERODECIMALES', this.tokenValidate).subscribe({
      next: (data: any) => {
        if(data.data.length > 0){
          const configReceive: ConfigReceive = data.data[0];

          const splitValue = configReceive.con_valor.split('.');
          this.fixedNumDecimal = splitValue[1].length
        }


        this.searchListaVentasWithFilter();
      },
      error: (error) => {
        console.log('error get num decimales');
        console.log(error);
      }
    });
  }


  copiarVentaClick(venta: any): void{
    this.router.navigate(['/ventas/crearventa', venta.id]); 
  }
}
