import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDeleteDialogComponent } from 'src/app/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';
import { ConfigReceive } from '../../configuraciones/models/ConfigReceive';
import { ImportarVentasDialogComponent } from '../dialogs/importar-ventas-dialog/importar-ventas-dialog.component';
import { ItemListaVenta } from '../models/ItemVentaModel';
import * as XLSX from 'xlsx';
import { VentaImport } from '../models/VentaImport';

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
  nombreBd: string = '';
  idUser: number = 0;
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

  file: File | null = null;
  arrayBuffer: any

  constructor(private coreService: ApplicationProvider,
    private loadingService: LoadingService,
    private ref: ChangeDetectorRef,
    private matDialog: MatDialog,
    private router: Router,
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
    this.idUser = localServiceResponseUsr._userId;
    this.rucEmpresa = localServiceResponseUsr._ruc;
    this.nombreBd = localServiceResponseUsr._nombreBd;

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
      this.noDocmento, dateInitString, dateFinString,this.tokenValidate, this.nombreBd).subscribe({
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
        this.datasource.paginator = this.paginator;
      },
      error: (error) => {
        dialogRef.close();
      }
    });
  }

  updateEstadoAnulado(idVenta: any, estado: any){

    const dialogRef = this.matDialog.open(ConfirmDeleteDialogComponent, {
      minWidth: '0',
      width: '400px',
      data: {title: 'Va a Anular la Venta, desea continuar?',
              header:'Anular Venta',
              textBtnPositive: 'Anular',
              textBtnCancelar: 'Cancelar'
            }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        
        let dialogReff = this.loadingService.open();

        this.coreService.updateEstadoVentaByIdEmp(this.idEmpresa,idVenta,estado, this.tokenValidate, this.nombreBd).subscribe({
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
      minWidth: '0',
      width: '400px',
      data: {
        title: 'Va a Eliminar la Venta, desea continuar?',
        header: 'Eliminar Venta'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        let dialogRef = this.loadingService.open();

        this.coreService.deleteVentaByIdEmp(this.idEmpresa,idVenta,estado, this.tokenValidate, this.nombreBd).subscribe({
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
    this.coreService.getConfigByNameIdEmp(this.idEmpresa,'VENTA_NUMERODECIMALES', this.tokenValidate, this.nombreBd).subscribe({
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

  exportarListaVentas(){
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

    this.coreService.getExcelListaVentas(this.idEmpresa,this.nombreCiRuc,this.noDocmento,
                                        dateInitString,dateFinString, this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {

        dialogRef.close();

        let downloadUrl = window.URL.createObjectURL(data);

        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', downloadUrl);
        link.setAttribute('download','lista_ventas');
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

  verPdfVenta(idVenta: any, identificacion: any, tipoVenta: any){
    
    let loadingRef = this.loadingService.open();

    this.coreService.getPdfFromVentaByIdEmp(this.idEmpresa,identificacion,idVenta,this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {
        loadingRef.close();

        let downloadUrl = window.URL.createObjectURL(data);

        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', downloadUrl);
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

  // METHODS TO IMPORT
  onFileChange(file: any){
    if(file.length === 0){
      return;
    }

    this.file = file[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file!!);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
    
      let workBook = XLSX.read(this.arrayBuffer, {type: "binary", cellDates: true});
      let first_sheet_name = workBook.SheetNames[0];
      let worksheet = workBook.Sheets[first_sheet_name];
      
      let arraylist = XLSX.utils.sheet_to_json(worksheet,{raw:true});

      //create a map for hold venta with listdetalles
      let listVentasMap : VentaImport[] = [];

      arraylist.forEach((item: any, index: number) => {

        if(item['identificacion'] == undefined || item['nombre'] == undefined || item['fecha'] == undefined || item['numeroventa'] == undefined
          || item['formapago'] == undefined || item['subtotal0'] == undefined || isNaN(item['subtotal0']) 
          || item['subtotal12'] == undefined || isNaN(item['subtotal12']) || item['valortotal'] == undefined || isNaN(item['valortotal']) 
          || item['codigoproducto'] == undefined || item['cantidad'] == undefined || isNaN(item['cantidad']) 
          || item['totaldetalle'] == undefined || isNaN(item['totaldetalle']) || item['iva'] == undefined || isNaN(item['iva'])
          || item['tipo_documento'] == undefined){
          return;
        }
        
        let identificacion = item['identificacion'].toString();
        if(identificacion.length == 9){
          identificacion = this.setCeroInLeft(identificacion);
        }else if(identificacion.length == 12){
          identificacion = this.setCeroInLeft(identificacion);
        }

        const selectedDate: Date = new Date(item['fecha']);
        const dateString =  '' + selectedDate.getFullYear() + '-' + ('0' + (selectedDate.getMonth()+1)).slice(-2) + 
                            '-' + ('0' + selectedDate.getDate()).slice(-2) + ' 12:00:00';

        let numeroVenta = item['numeroventa'].toString().trim();

        let ventaFound = listVentasMap.find(itemVentaDetalle => {
          return itemVentaDetalle.numero == numeroVenta;
        });

        let valorVenta: VentaImport = {
          fechaHora: dateString,
	        documento: item['tipo_documento'],
	        numero: item['numeroventa'],
	        total: item['valortotal'],
	        idUsuario: this.idUser,
	        cliente: item['nombre'],
	        cc_ruc_pasaporte: identificacion,
	        forma_pago: item['formapago'],
          subtotalIva: item['subtotal12'],
          subtotalCero: item['subtotal0'],
          valorIva: 0,
          listDetalle: []
        }

        if(ventaFound){
          let valorUnitario = (Number(item['totaldetalle']) / Number(item['cantidad']));
          
          ventaFound.listDetalle?.push({
              codigoproducto: item['codigoproducto'],
              cantidad: item['cantidad'],
              valorUnitario: valorUnitario.toFixed(2),
              totalDetalle: item['totaldetalle'],
              iva: item['iva']
          });
          
        }else{
          let valorUnitario = (Number(item['totaldetalle']) / Number(item['cantidad'])); 
          
          valorVenta.listDetalle?.push({
              codigoproducto: item['codigoproducto'],
              cantidad: item['cantidad'],
              valorUnitario: valorUnitario.toFixed(2),
              totalDetalle: item['totaldetalle'],
              iva: item['iva']
          });

          if(valorVenta['subtotalIva'] > 0){
            valorVenta.valorIva = Number((valorVenta['subtotalIva'] * 0.12).toFixed(2));
          }

          listVentasMap.push(valorVenta);
        }
      });

      if(listVentasMap.length <= 0) {
        this.toastr.error('No se encontraron ventas, verifique que el formato sea correcto.', '', {
          enableHtml: true,
          closeButton: true,
          timeOut: 10000,
          extendedTimeOut: 10000
        });
        return;
      }

      const dialogRef = this.matDialog.open(ImportarVentasDialogComponent, {
        minWidth: '0',
        width: '80%',
        panelClass: 'my-import-cliente-dialog',
        data: {
          listVentas: listVentasMap
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        // console.log('inside close dialog result');
      });

    }

  }

  private setCeroInLeft(valor: string): string{
    return '0' + valor;
  }


  getTemplateVentasExcel(){
    let dialogRef = this.loadingService.open();

    this.coreService.getTemplateVentasExcelIdEmp(this.idEmpresa, this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {
        dialogRef.close();

        let downloadUrl = window.URL.createObjectURL(data);

        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', downloadUrl);
        link.setAttribute('download','plantilla_ventas');
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

  printFactura(idVenta: Number){
    this.router.navigate([
      { outlets: {
        'print': ['print','receipt', idVenta, true]
        }
      }
    ]);
  }

}
