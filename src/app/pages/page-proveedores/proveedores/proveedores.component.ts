import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDeleteDialogComponent } from 'src/app/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { Proveedor } from 'src/app/interfaces/Proveedor';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';
import { ImportarProveedoresDialogComponent } from '../dialogs/importar-proveedores-dialog/importar-proveedores-dialog.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {

  displayedColumns: string[] = ['ci', 'nombre', 'email', 'telefono', 'observacion', 'actions'];
  datasource = new MatTableDataSource<Proveedor>();

  showPagination = false;
  showSinDatos = false;
  isLoading = false;
  listaProveedores: Proveedor[] = [];

  idEmpresa: number = 0;
  rucEmpresa: string = '';
  nombreBd: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  textSearchProveedores: string = '';

  file: File | null = null;
  arrayBuffer: any

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('containerTable', {read: ElementRef}) tableInput!: ElementRef

  constructor(private coreService: ApplicationProvider,              
              private loadingService: LoadingService,
              private router: Router,
              private matDialog: MatDialog,
              private ref: ChangeDetectorRef,
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

    this.getListaProveedoresRefresh();

  }

  private getListaProveedoresRefresh(){

    this.isLoading = !this.isLoading;

    let dialogRef = this.loadingService.open();

    this.coreService.getListProveedoresByIdEmp(this.idEmpresa, this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {

        dialogRef.close();

        this.isLoading = !this.isLoading;

        this.listaProveedores = data.data;

        if(this.listaProveedores.length > 0){
          this.showPagination = true;//!this.showPagination;
          this.showSinDatos = false
        }else{
          this.showSinDatos = !this.showSinDatos;
          this.showPagination = false
        }

        this.datasource.data = this.listaProveedores;
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

  nuevoProveedor(){
    this.router.navigate(['proveedores/nuevo']);
  }

  editarClick(idProv: any){
    this.router.navigate(['proveedores/editar', idProv]);
  }
  eliminarClick(idProv: any){
      const dialogRef = this.matDialog.open(ConfirmDeleteDialogComponent, {
        minWidth: '0',
        width: '400px',
        data: {
          title: 'Va a eliminar el proveedor, desea continuar?',
          header: 'Eliminar Proveedor'
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteProveedorApi(idProv);
      }
    });
  }

  private deleteProveedorApi(idProveedor: any): void{
    let dialogRef = this.loadingService.open();

    this.coreService.deleteProveedorByIdEmp(idProveedor, this.idEmpresa, this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {
        dialogRef.close();

        if(data.isSucess){
          this.getListaProveedoresRefresh();
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
        dialogRef.close();
      }
    });
    
  }


  searchProveedoresText(): void{

    this.isLoading = !this.isLoading;

    let dialogRef = this.loadingService.open();

    this.coreService.searchProveedoresByIdEmpText(this.idEmpresa, this.textSearchProveedores, this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {
        
        dialogRef.close();
        this.isLoading = !this.isLoading;

        this.listaProveedores = data.data;

        if(this.listaProveedores.length > 0){
          this.showPagination = true;
          this.showSinDatos = false
        }else{
          this.showSinDatos = true;
          this.showPagination = false
        }

        this.datasource.data = this.listaProveedores;
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

  exportarProveedores(){
    let dialogRef = this.loadingService.open();

    this.coreService.getExcelListProveedores(this.idEmpresa, this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {

        dialogRef.close();

        let downloadUrl = window.URL.createObjectURL(data);

        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', downloadUrl);
        link.setAttribute('download','proveedores');
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

    /*let nameFile = file[0].name;
    const mimeType = file[0].type;*/

    this.file = file[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file!!);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      //let data = new Uint8Array(this.arrayBuffer);
    
      let workBook = XLSX.read(this.arrayBuffer, {type: "binary", cellDates: true});
      let first_sheet_name = workBook.SheetNames[0];
      let worksheet = workBook.Sheets[first_sheet_name];
      //console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
      let arraylist = XLSX.utils.sheet_to_json(worksheet,{raw:true});

      let listProveedoresMap : Proveedor[] = [];
      arraylist.forEach((item: any) => {
        if(item['identificacion'] == undefined || item['nombres'] == undefined || item['razon_social'] == undefined /*|| item['email'] == undefined*/){
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

        // const selectedDate: Date = new Date(item['fechanacimiento']);
        /*const dateString = '' + selectedDate.getFullYear() + '-' + ('0' + (selectedDate.getMonth()+1)).slice(-2) + 
                          '-' + ('0' + selectedDate.getDate()).slice(-2) ;*/

        let proveedorOtro = {
          pro_id: 0,
          pro_empresa_id: this.idEmpresa, 
          pro_tipo_documento_identidad: tipoIdentificacion,
          pro_documento_identidad: identificacion, 
          pro_nombre_natural: item['nombres'], 
          pro_razon_social: item['razon_social'],
          pro_observacion: '', 
          pro_telefono: item['telefono'] ? item['telefono'] : '', 
          pro_celular: '', 
          pro_email: item['email'] ? item['email'] : '',
          pro_pagina_web: '', 
          pro_direccion: item['direccion'] ? item['direccion'] : '', 
          pro_cedula_representante: '', 
          pro_nombre_presentante: '', 
          pro_telefonos_representante: '', 
          pro_direccion_representante: '', 
          pro_mail_representante: ''
        }
        listProveedoresMap.push(proveedorOtro);
      });

      if(listProveedoresMap.length <= 0) { 

        this.toastr.error('No se encontraron proveedores, verifique el formato', '', {
          enableHtml: true,
          closeButton: true,
          timeOut: 20000,
          extendedTimeOut: 20000
        });
        return;
      }

      const dialogRef = this.matDialog.open(ImportarProveedoresDialogComponent, {
        minWidth: '0',
        width: '80%',
        panelClass: 'my-import-cliente-dialog',
        data: {
          listProveedores: listProveedoresMap
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('inside close dialog result');
      });

    }
  }

  private setCeroInLeft(valor: string): string{
    return '0' + valor;
  }

  getTemplateProveedoresExcel(){
    let dialogRef = this.loadingService.open();

    this.coreService.getTemplateProveedoresExcel(this.idEmpresa, this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {
        dialogRef.close();

        let downloadUrl = window.URL.createObjectURL(data);

        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', downloadUrl);
        link.setAttribute('download','plantilla_proveedores');
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
