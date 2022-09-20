import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';
import { ItemListaVenta } from '../models/ItemVentaModel';

@Component({
  selector: 'app-resumen-ventas',
  templateUrl: './resumen-ventas.component.html',
  styleUrls: ['./resumen-ventas.component.css']
})
export class ResumenVentasComponent implements OnInit {

  displayedColumns: string[] = ['fecha hora', 'documento', 'numero', 'cliente', 'identificacion', 'forma pago',
                              'subtotalIva','subtotalCero','valorIva', 'total'];
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
  
  calcSubtotal12 = 0.00;
  calcSubtotal0 = 0.00;
  calcIva = 0.00;
  calcTotal = 0.00;

  constructor(private loadingService: LoadingService,
    private coreService: ApplicationProvider,
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

    this.searchListaResumenVentasWithFilter();
  }


  private searchListaResumenVentasWithFilter(){
    
    let dialogRef = this.loadingService.open();
    
    if(!(this.dateInicioFilter && this.dateFinFilter)){
      dialogRef.close();
      console.log('verifique que las fechas sean correctas');
      return;
    }

    const dateInitString = '' + this.dateInicioFilter.getFullYear() + '-' + ('0' + (this.dateInicioFilter.getMonth()+1)).slice(-2) + 
                          '-' + ('0' + this.dateInicioFilter.getDate()).slice(-2) + ' ' + 
                            '00:00:00' ;
    const dateFinString = '' + this.dateFinFilter.getFullYear() + '-' + ('0' + (this.dateFinFilter.getMonth()+1)).slice(-2) + 
                            '-' + ('0' + this.dateFinFilter.getDate()).slice(-2) + ' ' + 
                              '23:59:59' ;

    this.coreService.getResumenVentasByIdEmp(this.idEmpresa, this.nombreCiRuc, 
      this.noDocmento, dateInitString, dateFinString,this.tokenValidate).subscribe({
          next: (results: any) => {
            dialogRef.close();
                          
            console.log(results.data);
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

  searchListaResumenVentasFilter(){
    this.searchListaResumenVentasWithFilter();
  }
}
