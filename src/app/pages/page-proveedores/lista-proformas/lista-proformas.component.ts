import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmDeleteDialogComponent } from 'src/app/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';
import { ItemListaProforma } from '../../page-clientes/models/ItemListaProforma';

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
    private ref: ChangeDetectorRef,
    private router: Router,
    private matDialog: MatDialog
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

   this.searchListaProformasWithFilter();
  }

  searchListaProformasWithFilter(){

    let dialogRef = this.loadingService.open();
    
    if(!(this.dateInicioFilter && this.dateFinFilter)){
      dialogRef.close();
      return;
    }

    const dateInitString = '' + this.dateInicioFilter.getFullYear() + '-' + ('0' + (this.dateInicioFilter.getMonth()+1)).slice(-2) + 
                          '-' + ('0' + this.dateInicioFilter.getDate()).slice(-2) + ' ' + '00:00:00' ;
    const dateFinString = '' + this.dateFinFilter.getFullYear() + '-' + ('0' + (this.dateFinFilter.getMonth()+1)).slice(-2) + 
                            '-' + ('0' + this.dateFinFilter.getDate()).slice(-2) + ' ' + '23:59:59' ;

    this.coreService.getListProformasByIdEmp(this.idEmpresa,this.nombreCiRuc, this.noDocmento, 
      dateInitString, dateFinString, this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) =>{
        dialogRef.close();

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

  nuevaProformaClick(){
    this.router.navigate(['proveedores//crearproforma']);
  }

  deleteProformaByIdEmp(idProforma: any){

    const dialogRef = this.matDialog.open(ConfirmDeleteDialogComponent, {
      minWidth: '0',
      width: '400px',
      data: {
        title: 'Va a Eliminar la Proforma, desea continuar?',
        header: 'Eliminar Proforma'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        let dialogRef = this.loadingService.open();

        this.coreService.deleteProformaByIdEmp(this.idEmpresa,idProforma,this.tokenValidate, this.nombreBd).subscribe({
          next: (results: any) => {
            dialogRef.close();
            console.log('proforma eliminadacorrectamente');
            console.log(results);
            this.searchListaProformasWithFilter();
          },
          error: (error) => {
            console.log('error eliminando proforma');
            console.log(error);
            dialogRef.close();
          }
        });
      }

    });

  }

  exportarListaProformas(){
    let dialogRef = this.loadingService.open();

    if(!(this.dateInicioFilter && this.dateFinFilter)){
      dialogRef.close();
      return;
    }

    const dateInitString = '' + this.dateInicioFilter.getFullYear() + '-' + ('0' + (this.dateInicioFilter.getMonth()+1)).slice(-2) + 
                          '-' + ('0' + this.dateInicioFilter.getDate()).slice(-2) + ' ' + '00:00:00' ;
    const dateFinString = '' + this.dateFinFilter.getFullYear() + '-' + ('0' + (this.dateFinFilter.getMonth()+1)).slice(-2) + 
                            '-' + ('0' + this.dateFinFilter.getDate()).slice(-2) + ' ' + '23:59:59' ;

    this.coreService.getExcelListaProformas(this.idEmpresa,this.nombreCiRuc,this.noDocmento,
                                        dateInitString,dateFinString, this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {

        dialogRef.close();

        let downloadUrl = window.URL.createObjectURL(data);

        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', downloadUrl);
        link.setAttribute('download','lista_proformas_provee');
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

  verPdfProforma(idProforma: any, identificacion: any){
    
    let loadingRef = this.loadingService.open();

    this.coreService.getPdfFromProformaByIdEmp(this.idEmpresa, identificacion, idProforma, this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {
        loadingRef.close();

        let downloadUrl = window.URL.createObjectURL(data);

        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', downloadUrl);
        link.setAttribute('download','detalle-proforma');
        document.body.appendChild(link);
        link.click();
        link.remove();

      },
      error: (error: any) => {
        console.log('ocurrio un error');
        console.log(error);

        loadingRef.close();
      }
    });
    
  }

  copiarProformaClick(proforma: any){
    this.router.navigate(['/proveedores/crearproforma', proforma.id]); 
  }

  convertirEnCompraClick(proforma: any){
    this.router.navigate(['/compras/crearcompra'], {state: {idProf: proforma.id}});
  }

}
