import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';

@Component({
  selector: 'app-crear-editar-punto-emision',
  templateUrl: './crear-editar-punto-emision.component.html',
  styleUrls: ['./crear-editar-punto-emision.component.css']
})
export class CrearEditarPuntoEmisionComponent implements OnInit {

  sendDatosEmpresaForm: FormGroup;
  imgURL: any;
  base64: string = '';
  imgExtensionFile: string = '';
  idEmpresa: number = 0;
  rucEmpresa: string = '';
  nombreBd: string = '';

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
    private sanitizer: DomSanitizer,
    private location: Location
  ) { 

    this.sendDatosEmpresaForm = this.formBuilder.group({
      ruc: [{value: '', disabled: true}, Validators.required],
      establecimiento: ['', [Validators.required, Validators.maxLength(250)]],
      nombreEmpresa: ['', [Validators.required, Validators.maxLength(250)]],
      direccion: ['', [Validators.required, Validators.maxLength(250)]],
      telefono: ['', [Validators.required, Validators.maxLength(250)]]
    });
  }

  ngOnInit(): void {
  }


  cancelarClick(){
    this.location.back();
  }

  preview(files: any){
    if(files.length === 0){
      console.log('el archivo es vacio');
      return;
    }

    let nameImg = files[0].name;
    const mimeType = files[0].type;
    let imagePath = files;

    this.imgExtensionFile = mimeType.split('/')[1];

    if (mimeType.match(/image\/*/) == null) {
      //this.mensajeError = `Error tipo de archivo no valido ${mimeType}`;
      //this.limpiarImagen();
      console.log('tipo de archivo no valido');
      return;
    }

    if (mimeType !== 'image/png' && mimeType !== 'image/jpg' && mimeType !== 'image/jpeg') {
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

  changeNumFac(){
    console.log(this.sendDatosEmpresaForm.controls['']);
  }
}
