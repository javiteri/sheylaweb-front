import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, SecurityContext, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDeleteDialogComponent } from 'src/app/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/application/application';
import { LoadingService } from 'src/app/services/Loading.service';
import {Cliente} from '../../../interfaces/Cliente'
import * as XLSX from 'xlsx';
import { ImportarClientesDialogComponent } from '../dialogs/importar-clientes-dialog/importar-clientes-dialog.component';

@Component({
  selector: 'app-page-clientes',
  templateUrl: './page-clientes.component.html',
  styleUrls: ['./page-clientes.component.css']
})
export class PageClientesComponent implements OnInit {

  displayedColumns: string[] = ['ci', 'nombre', 'email', 'tipo', 'telefono', 'nacionalidad', 'actions'];
  datasource = new MatTableDataSource<Cliente>();

  showPagination = false;
  showSinDatos = false;
  isLoading = false;
  listaClientes: Cliente[] = [];

  showPaginationDialog = false;
  listClientesImport: Cliente[] = [];

  idEmpresa: number = 0;
  rucEmpresa: string = '';
  nombreBd: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  textSearchClientes: string = '';

  file: File | null = null;
  arrayBuffer: any

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(private coreService: ApplicationProvider ,
              private ref: ChangeDetectorRef,
              private loadingService: LoadingService,
              private router: Router,
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

      this.getListaClientesRefresh();      

  }


  private getListaClientesRefresh(){

    this.isLoading = !this.isLoading;
    let dialogRef = this.loadingService.open();

    this.coreService.getListClientesByIdEmp(this.idEmpresa, this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {

        dialogRef.close();

        this.isLoading = !this.isLoading;
        this.listaClientes = data.data;
        
        if(this.listaClientes.length > 0){
          this.showPagination = true;
          this.showSinDatos = false
        }else{
          this.showSinDatos = !this.showSinDatos;
          this.showPagination = false
        }
        
        this.datasource.data = this.listaClientes;
        this.ref.detectChanges();
        this.datasource.paginator = this.paginator;
      },
      error: (error) => {
        dialogRef.close();

        this.isLoading = !this.isLoading;
        this.showSinDatos = !this.showSinDatos;

      }
    });

  }

  nuevoCliente(){
    this.router.navigate(['/clientes/nuevo']);
  }

  scrollUp(): void{
    //setTimeout( () => this.tableInput.nativeElement.scrollIntoView({behavior: 'smooth', clock: 'end'}));
  }

  editarClick(idCli: any){
    this.router.navigate(['/clientes/editar', idCli]);
  }

  eliminarClick(idCliente: any): void{  
    const dialogRef = this.matDialog.open(ConfirmDeleteDialogComponent, {        
        minWidth: '0',
        width: '400px',
        data: {
          title: 'Va a eliminar el cliente, desea continuar?',
          header: 'Eliminar Cliente'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteClienteApi(idCliente);
      }
    });
  }

  private deleteClienteApi(idCliente: any): void{
    let dialogRef = this.loadingService.open();

    this.coreService.deleteClienteByIdEmp(idCliente, this.idEmpresa, this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {
        dialogRef.close();
        if(data.isSucess){
          this.getListaClientesRefresh();
        }else{
          if(data.tieneMovimientos){
            this.toastr.error('No se puede eliminar, presenta movimientos', '', {
              timeOut: 3000,
              closeButton: true
            });
          }
        }
      },
      error: (error: any) => {
        console.log(error);
        dialogRef.close();
      }
    });
    
  }

  searchClientesText(): void{

    this.isLoading = !this.isLoading;

    let dialogRef = this.loadingService.open();

    this.coreService.searchClientesByIdEmpText(this.idEmpresa, this.textSearchClientes, this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {
        dialogRef.close();
        this.isLoading = !this.isLoading;

        this.listaClientes = data.data;

        if(this.listaClientes.length > 0){
          this.showPagination = true;
          this.showSinDatos = false
        }else{
          this.showSinDatos = true;
          this.showPagination = false
        }

        this.datasource.data = this.listaClientes;
        this.ref.detectChanges();
        this.datasource.paginator = this.paginator;

      },
      error: (error: any) => {
        dialogRef.close();

        this.isLoading = !this.isLoading;
        this.showSinDatos = !this.showSinDatos;
      }
    });
  }


  exportarClientes(){
    let dialogRef = this.loadingService.open();

    this.coreService.getExcelListClientes(this.idEmpresa, this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {
        dialogRef.close();

        let downloadUrl = window.URL.createObjectURL(data);

        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', downloadUrl);
        link.setAttribute('download','clientes');
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

      let listClientesMap : Cliente[] = [];
      arraylist.forEach((item: any) => {
        if(item['identificacion'] == undefined || item['nombres'] == undefined || item['razonsocial'] == undefined || item['email'] == undefined){
          return;
        }

        let tipoIdentificacion = 'CI';
        let identificacion = item['identificacion'].toString();
        if(identificacion.length == 9){
          identificacion = this.setCeroInLeft(identificacion);
        }else if(identificacion.length == 12){
          identificacion = this.setCeroInLeft(identificacion);
          tipoIdentificacion = 'RUC'
        }

        const selectedDate: Date = new Date(item['fechanacimiento']);
        const dateString = '' + selectedDate.getFullYear() + '-' + ('0' + (selectedDate.getMonth()+1)).slice(-2) + 
                          '-' + ('0' + selectedDate.getDate()).slice(-2) ;

        let clienteOtro = {
            cli_id : 0,
            cli_empresa_id: this.idEmpresa,
            cli_nacionalidad: item['nacionalidad'],
            cli_documento_identidad: identificacion,
            cli_tipo_documento_identidad: tipoIdentificacion,
            cli_nombres_natural: item['nombres'],
            cli_razon_social: item['razonsocial'],
            cli_observacion: item['observacion'] ? item['observacion'] : '',
            cli_fecha_nacimiento: dateString,
            cli_teleono: item['telefono'] ? item['telefono'] : '',
            cli_celular: item['celular'] ? item['celular'] : '',
            cli_email: item['email'],
            cli_direccion: item['direccion'] ? item['direccion'] : '',
            cli_profesion: ''
        }
        listClientesMap.push(clienteOtro);
      });

      if(listClientesMap.length <= 0) { 

        this.toastr.error('No se encontraron clientes, verifique que el formato sea correcto.', '', {
          enableHtml: true,
          closeButton: true,
          timeOut: 10000,
          extendedTimeOut: 10000
        });
        return;
      }

      
      const dialogRef = this.matDialog.open(ImportarClientesDialogComponent, {
        minWidth: '0',
        width: '80%',
        panelClass: 'my-import-cliente-dialog',
        data: {
          listClientes: listClientesMap
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

  getTemplateClientesExcel(){
    let dialogRef = this.loadingService.open();

    this.coreService.getTemplateClientesExcel(this.idEmpresa, this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {
        dialogRef.close();

        let downloadUrl = window.URL.createObjectURL(data);

        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', downloadUrl);
        link.setAttribute('download','plantilla_clientes');
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
