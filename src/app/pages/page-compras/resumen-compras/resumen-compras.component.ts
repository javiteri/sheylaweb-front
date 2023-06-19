import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';
import { ItemListaCompra } from '../models/ItemListaCompra';

@Component({
  selector: 'app-resumen-compras',
  templateUrl: './resumen-compras.component.html',
  styleUrls: ['./resumen-compras.component.css']
})
export class ResumenComprasComponent implements OnInit {

  displayedColumns: string[] = ['fecha hora', 'documento', 'numero', 'proveedor', 'identificacion', 'forma pago',
                              'subtotalIva','subtotalCero','valorIva', 'total'];
  datasource = new MatTableDataSource<ItemListaCompra>();
  
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
  
  calcSubtotal12 = "0.00";
  calcSubtotal0 = "0.00";
  calcIva = "0.00";
  calcTotal = "0.00";

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
    this.nombreBd = localServiceResponseUsr._nombreBd;

    this.searchListaResumenVentasWithFilter();
  }


  searchListaResumenVentasWithFilter(){
    
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

    this.coreService.getResumenComprasByIdEmp(this.idEmpresa, this.nombreCiRuc, 
      this.noDocmento, dateInitString, dateFinString,this.tokenValidate, this.nombreBd).subscribe({
          next: (results: any) => {
            dialogRef.close();
            
            let calcSubtotal0 = 0.0;
            let calcSubtotal12 = 0.0;
            let calcIva = 0.0;
            let calcTotal = 0.0;

            const listWithThreeDecimals = Array.from(results.data).map((valor: any,index) => {
              
              valor.subtotalIva = (Number(valor.subtotalIva).toFixed(3)).toString();
              valor.subtotalCero = (Number(valor.subtotalCero).toFixed(3)).toString();
              valor.valorIva = (Number(valor.valorIva).toFixed(3)).toString();
              valor.total = (Number(valor.total).toFixed(2)).toString();

              calcSubtotal0 += Number(valor.subtotalCero);
              calcSubtotal12 += Number(valor.subtotalIva);
              calcIva += Number(valor.valorIva);
              calcTotal += Number(valor.total);

              return valor;
            });

            try{    

              this.calcSubtotal0 = calcSubtotal0.toFixed(3);
              this.calcSubtotal12 = calcSubtotal12.toFixed(3);
              this.calcIva = calcIva.toFixed(3);
              this.calcTotal = calcTotal.toFixed(3);

              this.showPagination = results.data.length > 0;
              this.showSinDatos = !(results.data.length > 0);
            }catch(error){
              this.showPagination = false;
            }
                          
            this.datasource.data = listWithThreeDecimals;
            this.ref.detectChanges();
            this.datasource.paginator = this.paginator;
          },
          error: (error) => {
            dialogRef.close();
          }
        });
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

    this.coreService.getExcelListaResumenCompras(this.idEmpresa,this.nombreCiRuc,this.noDocmento,
                                        dateInitString,dateFinString, this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {

        dialogRef.close();

        let downloadUrl = window.URL.createObjectURL(data);

        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', downloadUrl);
        link.setAttribute('download','resumen_compras');
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
