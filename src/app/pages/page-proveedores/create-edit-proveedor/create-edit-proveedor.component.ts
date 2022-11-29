import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';

@Component({
  selector: 'app-crete-edit-proveedor',
  templateUrl: './create-edit-proveedor.component.html',
  styleUrls: ['./create-edit-proveedor.component.css']
})
export class CreateEditProveedorComponent implements OnInit, AfterViewInit{

  tiposId = [
    {valor: 'RUC', valorMostrar: 'RUC'},
    {valor: 'CI', valorMostrar: 'CI'}
  ]

  sendDatosFormProveedor : FormGroup;
  
  idProveedorEdit: number = 0;
  idEmpresa: number = 0;
  rucEmpresa: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  loading = false;
  editMode = false;

  titlePage = 'Nuevo Proveedor'
  identificacionInput! : ElementRef<HTMLInputElement>;
  @ViewChild('identificacionInput') set inputElRef(elRef: ElementRef<HTMLInputElement>){
    if(elRef){
      this.identificacionInput = elRef;
    }
  }

  constructor(private formBuilder: FormBuilder,
    private coreService: ApplicationProvider,
    private loadingService: LoadingService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private location: Location){ 

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

    this.route.paramMap.subscribe((params: any) => {

        let idProveedor = params.get('id');
        this.idProveedorEdit = idProveedor;
        if(idProveedor){
          this.editMode = true;
          this.titlePage = 'Editar Proveedor';
          this.getProveedorById(idProveedor);

        }else{

          this.sendDatosFormProveedor.controls['tipoIdentificacion'].setValue(this.tiposId[1].valor);

        }

    });
  }

  private getProveedorById(idProveedor: any){
    let dialogRef = this.loadingService.open();

    this.coreService.getProveedorByIdProvIdEmp(idProveedor, this.idEmpresa, this.tokenValidate).subscribe({
        next: (data: any) =>{
          dialogRef.close();

          const datosProveedor = data.data[0];

          this.sendDatosFormProveedor.controls['tipoIdentificacion'].setValue(datosProveedor['pro_tipo_documento_identidad']);
          this.sendDatosFormProveedor.controls['documentoIdentidad'].setValue(datosProveedor['pro_documento_identidad']);
          this.sendDatosFormProveedor.controls['nombreNatural'].setValue(datosProveedor['pro_nombre_natural']);
          this.sendDatosFormProveedor.controls['razonSocial'].setValue(datosProveedor['pro_razon_social']);
          this.sendDatosFormProveedor.controls['direccion'].setValue(datosProveedor['pro_direccion']);
          this.sendDatosFormProveedor.controls['telefono'].setValue(datosProveedor['pro_telefono']);
          this.sendDatosFormProveedor.controls['celular'].setValue(datosProveedor['pro_celular']);
          this.sendDatosFormProveedor.controls['email'].setValue(datosProveedor['pro_email']);
          this.sendDatosFormProveedor.controls['paginaWeb'].setValue(datosProveedor['pro_pagina_web']);
          this.sendDatosFormProveedor.controls['observacion'].setValue(datosProveedor['pro_observacion']);

          this.sendDatosFormProveedor.controls['identificacionRepre'].setValue(datosProveedor['pro_cedula_representante']);
          this.sendDatosFormProveedor.controls['nombreRepre'].setValue(datosProveedor['pro_nombre_presentante']);
          this.sendDatosFormProveedor.controls['telefonoRepre'].setValue(datosProveedor['pro_telefonos_representante']);
          this.sendDatosFormProveedor.controls['emailRepre'].setValue(datosProveedor['pro_mail_representante']);
          this.sendDatosFormProveedor.controls['direccionRepre'].setValue(datosProveedor['pro_direccion_representante']);
          
        },
        error: (error) => {
          dialogRef.close();
        }
    });
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

    if(this.editMode){
      sendFormProveedor['idProveedor'] = this.idProveedorEdit;
      this.updateDatosProveedorApi(sendFormProveedor);
    }else{
      this.insertDatosProveedorApi(sendFormProveedor);
    }
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

        this.resetControlsForm();

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

  private updateDatosProveedorApi(sendFormProveedor: any){
    let overlayRef = this.loadingService.open();

    this.coreService.updateProveedorToBD(sendFormProveedor, this.tokenValidate).subscribe({
      next: (data: any) => {

        overlayRef.close();
        if(data.code == 400){
          return;
        }

        this.toastr.success('Proveedor Actualizado', '', {
          timeOut: 3000,
          closeButton: true
        });

        setTimeout(() => {
          this.router.navigate(['/proveedores']);
        }, 600);

      },
      error: (error) => {
        overlayRef.close();

        this.toastr.error(error.error.message, '', {
          timeOut: 3000,
          closeButton: true
        });
      }
    });
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

    this.coreService.searchClienteByCiRuc(identificacion).subscribe({
      next: (res) => {
        const dataArray = res.split(/\*+|\$+/);

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

        dialogRef.close();
      },
      error: (err) => {
        dialogRef.close();
      }

   });

  }


  private resetControlsForm(){
    this.sendDatosFormProveedor.controls['documentoIdentidad'].setValue('');
    this.sendDatosFormProveedor.controls['nombreNatural'].setValue('');
    this.sendDatosFormProveedor.controls['razonSocial'].setValue('');
    this.sendDatosFormProveedor.controls['direccion'].setValue('');
    this.sendDatosFormProveedor.controls['telefono'].setValue('');
    this.sendDatosFormProveedor.controls['celular'].setValue('');
    this.sendDatosFormProveedor.controls['email'].setValue('');
    this.sendDatosFormProveedor.controls['paginaWeb'].setValue('');
    this.sendDatosFormProveedor.controls['observacion'].setValue('');
    this.sendDatosFormProveedor.controls['identificacionRepre'].setValue('');
    this.sendDatosFormProveedor.controls['nombreRepre'].setValue('');
    this.sendDatosFormProveedor.controls['telefonoRepre'].setValue('');
    this.sendDatosFormProveedor.controls['emailRepre'].setValue('');
    this.sendDatosFormProveedor.controls['direccionRepre'].setValue('');

    this.identificacionInput.nativeElement.focus();
    this.ref.detectChanges();
  }

  cancelarClick(){
    this.location.back();
  }
}
