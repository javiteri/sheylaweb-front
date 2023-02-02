import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';

@Component({
  selector: 'app-crear-proveedor-dialog',
  templateUrl: './crear-proveedor-dialog.component.html',
  styleUrls: ['./crear-proveedor-dialog.component.css']
})
export class CrearProveedorDialogComponent implements OnInit {

  tiposId = [
    {valor: 'RUC', valorMostrar: 'RUC'},
    {valor: 'CI', valorMostrar: 'CI'}
  ]

  sendDatosFormProveedor : FormGroup;
  loading = false;

  idEmpresa: number = 0;
  rucEmpresa: string = '';
  nombreBd: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;
  
  identificacionInput! : ElementRef<HTMLInputElement>;
  @ViewChild('identificacionInput') set inputElRef(elRef: ElementRef<HTMLInputElement>){
    if(elRef){
      this.identificacionInput = elRef;
    }
  }
  
  constructor(private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private coreService: ApplicationProvider,
    private toastr: ToastrService,
    public matDialogRef: MatDialogRef<CrearProveedorDialogComponent>,
    private ref: ChangeDetectorRef) {

    this.sendDatosFormProveedor = this.formBuilder.group({
      tipoIdentificacion: ['', Validators.required],
      documentoIdentidad: ['', [Validators.required]],
      nombreNatural: ['', Validators.required],
      razonSocial: [''],
      direccion: [''],
      telefono: [''],
      celular: [''],
      email: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      paginaWeb: [''],
      observacion: [''],
      identificacionRepre: [''],
      nombreRepre: [''],
      telefonoRepre: [''],
      emailRepre: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      direccionRepre: ['']
    });
   }

   ngAfterViewInit(): void {
    this.identificacionInput.nativeElement.focus();
    this.ref.detectChanges();
  }

  ngOnInit(): void {
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

    this.sendDatosFormProveedor.controls['tipoIdentificacion'].setValue(this.tiposId[1].valor);
  }


  searchdatosProveedorSri(identificacion: any, isSearchProve: boolean){
    
    if(isSearchProve){
      if(identificacion.length == 10){
        this.sendDatosFormProveedor.controls['tipoIdentificacion'].setValue(this.tiposId[1].valor);
      }
      if(identificacion.length == 13){
        this.sendDatosFormProveedor.controls['tipoIdentificacion'].setValue(this.tiposId[0].valor);
      }
    }

    if(identificacion.length == 10 || identificacion.length == 13){
        this.searchdatosProveedor(identificacion, isSearchProve);
    }
  }

  private searchdatosProveedor(identificacion: any, isSearchProve: boolean){

    let dialogRef = this.loadingService.open();

    this.coreService.searchClienteByCiRucApi(this.tokenValidate, identificacion).subscribe({
      next: (res: any) => {
        try{
          const dataArray = res['data'].split(/\*+|\$+/);

          if(dataArray.length >= 12){
            if(isSearchProve){
              this.sendDatosFormProveedor.controls['nombreNatural'].setValue(dataArray[1]);
              this.sendDatosFormProveedor.controls['direccion'].setValue(dataArray[dataArray.length - 2]);            
            }else{
              this.sendDatosFormProveedor.controls['nombreRepre'].setValue(dataArray[1]);
              this.sendDatosFormProveedor.controls['direccionRepre'].setValue(dataArray[dataArray.length - 2]);
            }
            
          }else{
            if(isSearchProve){
              this.sendDatosFormProveedor.controls['nombreNatural'].setValue(dataArray[1]);
              this.sendDatosFormProveedor.controls['direccion'].setValue(dataArray[dataArray.length - 2]);
              this.sendDatosFormProveedor.controls['observacion'].setValue(dataArray[dataArray.length - 3]);
            }else{
              this.sendDatosFormProveedor.controls['nombreRepre'].setValue(dataArray[1]);
              this.sendDatosFormProveedor.controls['direccionRepre'].setValue(dataArray[dataArray.length - 2]);
            }
          }
        }catch(exception){}

        dialogRef.close();
      },
      error: (err) => {
        dialogRef.close();
      }

   });
  }

  cancelarClick(){
    this.matDialogRef.close();
  }

  saveDatosProveedor(sendFormProveedor: any){
    if(this.sendDatosFormProveedor.invalid){
      this.loading = false;

      this.toastr.error('verifique que los datos esten llenos', '', {
          timeOut: 3000,
          closeButton: true
        });

      return;
    }

    sendFormProveedor['idEmpresa'] = this.idEmpresa;
    sendFormProveedor['nombreBd'] = this.nombreBd;

    this.insertDatosProveedorApi(sendFormProveedor);
  }

  private insertDatosProveedorApi(sendFormProveedor: any){
    let overlayRef = this.loadingService.open();

    this.coreService.insertProveedorToBD(sendFormProveedor, this.tokenValidate).subscribe({
      next: (data: any) => {

        overlayRef.close();
        if(data.code == 400){
          return;
        }

        this.toastr.success('Proveedor Guardado', '', {
          timeOut: 3000,
          closeButton: true
        });

        this.matDialogRef.close(data);

      },
      error: (error) => {
        overlayRef.close();

        if(error.error.duplicate){

          this.toastr.error(error.error.messageError, '', {
            timeOut: 3000,
            closeButton: true
          });
          return;
        }

        this.toastr.error('error al guardar', '', {
          timeOut: 3000,
          closeButton: true
        });
      }
    });
  }

}
