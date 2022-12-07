import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { map, Subscription, timer } from 'rxjs';
import { ConfirmDeleteDialogComponent } from 'src/app/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';
import { DocumentoElectronicoItem } from '../models/DocumentoElectronicoItem';

@Component({
  selector: 'app-documentos-electronicos',
  templateUrl: './documentos-electronicos.component.html',
  styleUrls: ['./documentos-electronicos.component.css']
})
export class DocumentosElectronicosComponent implements OnInit {

  displayedColumns: string[] = ['fecha', 'numeroFactura', 'total', 'cliente', 'ci_ruc','formaPago','estado','actions'];
  datasource = new MatTableDataSource<DocumentoElectronicoItem>();

  tipoDocumentoSelect = 'TODOS';
  listTipoDocumento = ['TODOS','FACTURA', 'LIQUIDACIONES DE COMPRA'];

  dateInicioFilter = new Date();
  dateFinFilter = new Date();
  
  idEmpresa: number = 0;
  rucEmpresa: string = '';
  nombreBd: string = ''
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  showPagination = false;
  showSinDatos = false;

  nombreClienteCi = '';
  numeroDocumento = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  timerSubscription?: Subscription;
  isShowMostrarNoAutorizados = false;

  isShowLoadingAutorizandoDoc = false;
  textShowLoadingAutorizandoDoc = 'Autorizando Documentos';
  isFirstOpenPage = true;

  constructor(private coreService: ApplicationProvider,
    private loadingService: LoadingService,
    private matDialog: MatDialog,
    private toastr: ToastrService) { }

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
    
    this.timerSubscription = timer(0,10000).pipe(
      map(() => {
        if(this.isShowMostrarNoAutorizados){
          this.getListDocumentosElectronicosNoAutorizados(this.isFirstOpenPage);
        }else{
          this.getListaDocumentosElectronicos(this.isFirstOpenPage);
        }
      })
    ).subscribe();
  }

  getListDocumentosElectronicosNoAutorizados(firstOpenPage: boolean){
    
    this.isShowMostrarNoAutorizados = true;


    let loadingRef: any;
    if(firstOpenPage){
      loadingRef = this.loadingService.open()
      this.isFirstOpenPage = false;
    }

    this.coreService.getListDocumentosElectronicosByIdEmpNoAutorizados(this.idEmpresa,this.tokenValidate, this.nombreBd).subscribe({
    next: (data: any) => {

      if(data.data && data.data.length > 0){
        this.datasource.data = data.data;
        this.showSinDatos = false;
      }else{
        this.datasource.data = [];
        this.showSinDatos = true;
      }

      if(loadingRef != null){
        loadingRef.close();
      }
      
    },
    error: (error: any) => {
      if(loadingRef != null){
        loadingRef.close();
      }
    }
    });
  }

  getListaDocumentosElectronicos(firstOpenPage: boolean){

    this.isShowMostrarNoAutorizados = false;

    const dateInitString = '' + this.dateInicioFilter.getFullYear() + '-' + ('0' + (this.dateInicioFilter.getMonth()+1)).slice(-2) + 
                          '-' + ('0' + this.dateInicioFilter.getDate()).slice(-2) + ' ' + 
                            '00:00:00' ;
    const dateFinString = '' + this.dateFinFilter.getFullYear() + '-' + ('0' + (this.dateFinFilter.getMonth()+1)).slice(-2) + 
                            '-' + ('0' + this.dateFinFilter.getDate()).slice(-2) + ' ' + 
                              '23:59:59' ;

    const tipo = (this.tipoDocumentoSelect == 'TODOS') ? '' : this.tipoDocumentoSelect;

    let loadingRef: any = null;

    if(firstOpenPage){
      loadingRef = this.loadingService.open()
      this.isFirstOpenPage = false;
    }

    this.coreService.getListDocumentosElectronicosByIdEmp(this.idEmpresa,dateInitString,dateFinString,tipo,this.nombreClienteCi,
                                                          this.numeroDocumento,this.tokenValidate, this.nombreBd).subscribe({
        next: (data: any) => {

          if(data.data && data.data.length > 0){
            this.datasource.data = data.data;
            this.showSinDatos = false;
          }else{
            this.datasource.data = [];
            this.showSinDatos = true;
          }

          if(loadingRef != null){
            loadingRef.close();
          }
          
        },
        error: (error: any) => {
          if(loadingRef != null){
            loadingRef.close();
          }
        }
    });
  }

  verPdfVenta(idVenta: any, identificacion: any, tipoVenta: any){
    
    if(tipoVenta != 'Factura' && tipoVenta != 'FACTURA'){
      return;
    }
    let loadingRef = this.loadingService.open();

    this.coreService.getPdfFromVentaByIdEmp(this.idEmpresa,identificacion,idVenta,this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {
        loadingRef.close();

        let downloadUrl = window.URL.createObjectURL(data);

        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', downloadUrl);
        //link.setAttribute('href', downloadUrl);
        link.setAttribute('download','detalle-venta');
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

  autorizarDoc(idVentaCompra: number,identificacion: string,tipo: string, estado: string, 
    numeroFactura: string): void{

    let arrayListSend = [{
      idEmp: this.idEmpresa,
      identificacion: identificacion,
      id: idVentaCompra,
      VENTA_TIPO: tipo,
      estado: estado
    }];
    
    const sendData = {
      list: arrayListSend,
      rucEmpresa: this.rucEmpresa,
      nombreBd: this.nombreBd
    }

    this.textShowLoadingAutorizandoDoc = `Autorizando Documento`;

    this.sendListDocAutorizarObserver(sendData);

  }

  autorizarListDocumentos(): void{
    const dialogRef = this.matDialog.open(ConfirmDeleteDialogComponent, {
      minWidth: '0',
      width: '400px',
      data: {
        title: 'Se enviaran los documentos para su autorización, desea continuar?',
        header: 'Autorizar Documentos',
        textBtnPositive: 'Autorizar',
        textBtnCancelar: 'Cancelar',
        isNormalColors: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){

        this.textShowLoadingAutorizandoDoc = `Autorizando Documentos `;

        this.sendDocumentosAutorizar();
      }
    });

  }  

  sendDocumentosAutorizar(){
    const listSend = this.datasource.data.filter((documento: any) => {
      return documento.estado != 2
    });
    listSend.forEach((documento) => {
      documento.idEmp = this.idEmpresa;
    });

    if(listSend.length == 0){
      return;
    }
    
    const sendData = {
      list: listSend,
      rucEmpresa: this.rucEmpresa,
      nombreBd: this.nombreBd
    }

    this.sendListDocAutorizarObserver(sendData);
  }

private sendListDocAutorizarObserver(sendData: any){

  this.isShowLoadingAutorizandoDoc = true;

    const loadingRef = this.loadingService.open();
    this.coreService.autorizarListDocumentoElectronico(sendData,this.tokenValidate)
      .subscribe({
        next: (data: any) => {
          loadingRef.close();
          if(data.isSucess){
            this.toastr.success('Se autorizarán todos los documentos,por favor espere.', '', {
              timeOut: 10000,
              closeButton: true
            });
          }
        },
        error: (error: any) => {
          loadingRef.close();

          if(error.error.isDenyAutorizar == true){

            this.isShowLoadingAutorizandoDoc = false;
            this.toastr.error('Error, ya supero el número de documentos permitidos.', '', {
              timeOut: 5000,
              closeButton: true
            });
          }
        }
    });

}


  //-----------------------------------------------------------------------------------------
  exportExcelListDocumentos(){

    const dateInitString = '' + this.dateInicioFilter.getFullYear() + '-' + ('0' + (this.dateInicioFilter.getMonth()+1)).slice(-2) + 
                          '-' + ('0' + this.dateInicioFilter.getDate()).slice(-2) + ' ' + 
                            '00:00:00' ;
    const dateFinString = '' + this.dateFinFilter.getFullYear() + '-' + ('0' + (this.dateFinFilter.getMonth()+1)).slice(-2) + 
                            '-' + ('0' + this.dateFinFilter.getDate()).slice(-2) + ' ' + 
                              '23:59:59' ;

    const tipo = (this.tipoDocumentoSelect == 'TODOS') ? '' : this.tipoDocumentoSelect;

    let loadingRef = this.loadingService.open();

    this.coreService.getExcelListDocElectronic(this.idEmpresa,this.rucEmpresa ,dateInitString,dateFinString,tipo,this.nombreClienteCi,
      this.numeroDocumento,this.tokenValidate, this.nombreBd).subscribe({
        next: (data: any) => {

          loadingRef.close();

          let downloadUrl = window.URL.createObjectURL(data);

          const link = document.createElement('a');
          link.setAttribute('target', '_blank');
          link.setAttribute('href', downloadUrl);
          link.setAttribute('download','documentos_electronicos');
          document.body.appendChild(link);
          link.click();
          link.remove();
        },
        error: (error: any) => {
          loadingRef.close();
        }
      });
  }

  ngOnDestroy(): void{
    if(this.timerSubscription !== undefined){
      this.timerSubscription.unsubscribe();
    }
  }
} 
