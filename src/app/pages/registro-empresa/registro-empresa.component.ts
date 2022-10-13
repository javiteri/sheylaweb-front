import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationProvider } from '../../providers/provider';

import {TokenValidate} from '../../interfaces/IWebData';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/services/Loading.service';
import {ToastrService} from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-registro-empresa',
  templateUrl: './registro-empresa.component.html',
  styleUrls: ['./registro-empresa.component.css']
})
export class RegistroEmpresaComponent implements OnInit, AfterViewInit {

  sendDatosEmpresaForm: FormGroup;
  imgURL: any;
  base64: string = '';
  idEmpresa: number = 0;
  rucEmpresa: string = '';

  empresaData: any;

  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  loading = false;

  nombreEmpresaInput! : ElementRef<HTMLInputElement>;
  @ViewChild('nombreEmpresaInput') set inputElRef(elRef: ElementRef<HTMLInputElement>){
    if(elRef){
      this.nombreEmpresaInput = elRef;
    }
  }
  
  constructor(
    private formBuilder: FormBuilder,
    private coreService: ApplicationProvider,
    public router: Router,
    private loadingService: LoadingService,
    private toastr: ToastrService,
    private ref: ChangeDetectorRef,
    private sanitizer: DomSanitizer
    ) {

      this.sendDatosEmpresaForm = this.formBuilder.group({
        ruc: [{value: '', disabled: true}, Validators.required],
        nombreEmpresa: ['', [Validators.required, Validators.maxLength(250), Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
        razonSocial: ['', [Validators.required, Validators.maxLength(250), Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
        fechaInicio: [''],
        eslogan: ['', [Validators.maxLength(250)]],
        web: ['', [Validators.maxLength(250)]],
        email: ['', [Validators.email]],
        telefonos: ['', [Validators.required, Validators.maxLength(250), Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
        direccionMatriz: ['', [Validators.required, Validators.maxLength(250), Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
        sucursal1: ['', [Validators.maxLength(250)]],
        sucursal2: ['', [Validators.maxLength(250)]],
        sucursal3: ['', [Validators.maxLength(250)]],
        propietario: ['', [Validators.required, Validators.maxLength(250)]],
        comentario: ['', [Validators.maxLength(250)]]
      });

    }
  ngAfterViewInit(): void {
    this.nombreEmpresaInput.nativeElement.focus();
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

    let postData = {
      ruc: this.rucEmpresa,
      idEmpresa: this.idEmpresa
    }
    this.getDatosEmpresa(postData, this.tokenValidate);

    this.getLogoEmpresa();
  }


  private getDatosEmpresa(postData: any, accesToken: any ){

    let dialogRef = this.loadingService.open();

    this.loading = true;

    this.coreService.empresaByRucAndId(postData, accesToken).subscribe({
      next: (result) => {

        dialogRef.close();

        if(result.error){
          console.log(result.error);
          return;
        }

        this.empresaData = result.data[0];

        this.sendDatosEmpresaForm.controls['ruc'].setValue(this.empresaData['ruc']);
        this.sendDatosEmpresaForm.controls['nombreEmpresa'].setValue(this.empresaData['nombreEmp']);
        this.sendDatosEmpresaForm.controls['razonSocial'].setValue(this.empresaData['razonSocial']);
        this.sendDatosEmpresaForm.controls['fechaInicio'].setValue(this.empresaData['fechaInicio']);
        this.sendDatosEmpresaForm.controls['eslogan'].setValue(this.empresaData['slogan']);
        this.sendDatosEmpresaForm.controls['web'].setValue(this.empresaData['web']);
        
        
        if(this.empresaData['email'] == ' '){
          this.sendDatosEmpresaForm.controls['email'].setValue('');
        }else{
          this.sendDatosEmpresaForm.controls['email'].setValue(this.empresaData['email']);
        }
        
        this.sendDatosEmpresaForm.controls['telefonos'].setValue(this.empresaData['telefono']);
        this.sendDatosEmpresaForm.controls['direccionMatriz'].setValue(this.empresaData['direccionMatriz']);
        this.sendDatosEmpresaForm.controls['sucursal1'].setValue(this.empresaData['direccionSucursal1']);
        this.sendDatosEmpresaForm.controls['sucursal2'].setValue(this.empresaData['direccionSucursal2']);
        this.sendDatosEmpresaForm.controls['sucursal3'].setValue(this.empresaData['direccionSucursal3']);
        this.sendDatosEmpresaForm.controls['propietario'].setValue(this.empresaData['propietario']);
        this.sendDatosEmpresaForm.controls['comentario'].setValue(this.empresaData['comentarios']);

        this.loading = false;
      },
      error: (error) => {

        dialogRef.close();

        this.loading = false;

        let statusResponse;
        Object.keys(error).forEach(key => {
          if (key === 'status') {
            statusResponse = error[key]
          }
        });


        if(statusResponse === 401){
          this.router.navigate(['/login']);
        }

      }

    });

  }

  private getLogoEmpresa(): void{
    this.coreService.getImagenLogoByRucEmp(this.rucEmpresa, this.tokenValidate).subscribe({
      next: (data: any) => {
        console.log('ok logo');
        console.log(data);

        let objectURL = URL.createObjectURL(data);       
        this.imgURL = this.sanitizer.bypassSecurityTrustUrl(objectURL);

      },
      error: (error : any) => {
        console.log('inside error logo');
      }
    });
  }

  // SEND DATA TO SERVER
  updateDatosEmpresa(sendDatosEmpresaForm: any){

    
    this.loading = true;

    if(this.sendDatosEmpresaForm.invalid){
        this.loading = false;
        return;
    }

    let dialogRef = this.loadingService.open();

    const selectedDate: Date = new Date(sendDatosEmpresaForm['fechaInicio']);
    const dateString = '' + selectedDate.getFullYear() + '-' + ('0' + (selectedDate.getMonth()+1)).slice(-2) + '-' + ('0' + selectedDate.getDate()).slice(-2) ;

    sendDatosEmpresaForm['idEmpresa'] = this.idEmpresa;
    sendDatosEmpresaForm['fechaInicio'] = dateString;
    sendDatosEmpresaForm['img_base64'] = `data:image/png;base64,${this.base64}`;
    sendDatosEmpresaForm['ruc'] = this.rucEmpresa;

    this.coreService.updateDatosEmpresa(sendDatosEmpresaForm, this.tokenValidate).subscribe({
      next: (data: any) =>{
        dialogRef.close();

        this.toastr.success('Datos Actualizados', '', {
          timeOut: 3000,
          closeButton: true
        });

        console.log('Datos Actualizados');

        this.loading = false;
      },
      error: (error) => {
        console.log('error response update data: ' + error);

        this.toastr.error('error al actualizar', '', {
          timeOut: 3000,
          closeButton: true
        });

        dialogRef.close();
        this.loading = false;
      }

    });

  }

  preview(files: any){
    if(files.length === 0){
      console.log('el archivo es vacio');
      return;
    }

    let nameImg = files[0].name;
    const mimeType = files[0].type;
    let imagePath = files;

    if (mimeType.match(/image\/*/) == null) {
      //this.mensajeError = `Error tipo de archivo no valido ${mimeType}`;
      //this.limpiarImagen();
      console.log('tipo de archivo no valido');
      return;
    }

    if (mimeType !== 'image/png') {
      //this.mensajeError = `Error tipo: ${mimeType}  no valido`;
      //this.limpiarImagen();
      console.log(`Error tipo: ${mimeType}  no valido`);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      
      this.imgURL = reader.result!;
      const array = this.imgURL.split(',');
      this.base64 = array[1];
      console.log(this.base64);
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const height = img.naturalHeight;
        const width = img.naturalWidth;
        //this.height = height;
        if (width !== 415 && height !== 95) {
            //this.mensajeError = `Error ancho: ${width} y alto: ${height} no valido`;
            //this.limpiarImagen();
            return;
        }
        if (height !== 95) {
            //this.mensajeError = `Error ancho: ${width} no valido`;
            //this.limpiarImagen();
            return;
        }
        if (width !== 415) {
            //this.mensajeError = `Error alto: ${height} no valido`;
            //this.limpiarImagen();
            return;
        }
        //this.ErrorImage = false;
    };
    }

  } 

}
