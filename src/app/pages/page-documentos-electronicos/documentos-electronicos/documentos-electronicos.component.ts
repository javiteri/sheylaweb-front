import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  showPagination = false;
  showSinDatos = false;

  nombreClienteCi = '';
  numeroDocumento = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private coreService: ApplicationProvider,
    private loadingService: LoadingService) { }

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

    this.getListaDocumentosElectronicos();    
  }


  getListaDocumentosElectronicos(){

    const dateInitString = '' + this.dateInicioFilter.getFullYear() + '-' + ('0' + (this.dateInicioFilter.getMonth()+1)).slice(-2) + 
                          '-' + ('0' + this.dateInicioFilter.getDate()).slice(-2) + ' ' + 
                            '00:00:00' ;
    const dateFinString = '' + this.dateFinFilter.getFullYear() + '-' + ('0' + (this.dateFinFilter.getMonth()+1)).slice(-2) + 
                            '-' + ('0' + this.dateFinFilter.getDate()).slice(-2) + ' ' + 
                              '23:59:59' ;

    const tipo = (this.tipoDocumentoSelect == 'TODOS') ? '' : this.tipoDocumentoSelect;
    /*const tipoMovimiento = (this.tipoMovimientoSelect == 'TODOS') ? '' : this.tipoMovimientoSelect;*/

    let loadingRef = this.loadingService.open();

    this.coreService.getListDocumentosElectronicosByIdEmp(this.idEmpresa,dateInitString,dateFinString,tipo,this.nombreClienteCi,
      this.numeroDocumento,this.tokenValidate).subscribe({
        next: (data: any) => {
          console.log('inside ok ');
          console.log(data);

          if(data.data && data.data.length > 0){
            
            this.datasource.data = data.data;
          }else{
            this.datasource.data = [];
          }

          loadingRef.close();
        },
        error: (error: any) => {
          console.log('inside error ');
          loadingRef.close();
        }
      });
  }
} 
