import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter, map } from 'rxjs';
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

  titlePage = 'Nuevo Establecimiento'
  idEstablecimientoEdit = 0;
  //numeroEstablecimientoEdit = '';

  nombreEmpresaInput! : ElementRef<HTMLInputElement>;
  @ViewChild('nombreEmpresaInput') set inputElRef(elRef: ElementRef<HTMLInputElement>){
    if(elRef){
      this.nombreEmpresaInput = elRef;
    }
  }
  
  constructor(
    private formBuilder: FormBuilder,
    private coreService: ApplicationProvider,
    private router: Router,
    private route: ActivatedRoute,
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


    this.route.paramMap.subscribe((params: any) => {                                                                              

      let idEstablecimiento = params.get('id');
      
      if(idEstablecimiento){
        this.idEstablecimientoEdit = idEstablecimiento;
        this.titlePage = 'Editar Establecimiento';
        try{
          const currentState = this.router.getCurrentNavigation()!;
          let numeroEstablecimientoEdit = currentState.extras.state!['numeroEstablecimiento'];
          this.getEstablecimientoById(idEstablecimiento);
          this.getLogoEstablecimiento(numeroEstablecimientoEdit);
        }catch(err){
          this.location.back();
        }
        
        
      }

    });

  }

  ngOnInit(): void {
    this.sendDatosEmpresaForm.controls['ruc'].setValue(this.rucEmpresa);
  }


  cancelarClick(){
    this.location.back();
  }

  preview(files: any){
    if(files.length === 0){
      console.log('el archivo es vacio');
      return;
    }

    const mimeType = files[0].type;
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
    let valorEstablecimiento = this.sendDatosEmpresaForm.controls['establecimiento'].value;
    valorEstablecimiento = (valorEstablecimiento.length == 1) ? `00${valorEstablecimiento}` :  valorEstablecimiento;
    valorEstablecimiento = (valorEstablecimiento.length == 2) ? `0${valorEstablecimiento}` :  valorEstablecimiento;

    this.sendDatosEmpresaForm.controls['establecimiento'].setValue(valorEstablecimiento);
  }


  // SEND DATA TO SERVER
  guardarDatosEstablecimiento(sendDatosEstablecimiento: any){
    if(this.sendDatosEmpresaForm.invalid){
      return;
    }

    if(this.idEstablecimientoEdit != 0){
      this.actualizarDatosEmpresa(sendDatosEstablecimiento);
    }else{
      let dialogRef = this.loadingService.open();

      sendDatosEstablecimiento['idEmpresa'] = this.idEmpresa;

      if(this.base64){
        sendDatosEstablecimiento['img_base64'] = `data:image/${this.imgExtensionFile};base64,${this.base64}`;
        sendDatosEstablecimiento['extensionFile'] = this.imgExtensionFile;
      }else{
        sendDatosEstablecimiento['img_base64'] = ``;
      }
      sendDatosEstablecimiento['ruc'] = `${this.rucEmpresa}${this.sendDatosEmpresaForm.controls['establecimiento'].value}`;
      sendDatosEstablecimiento['nombreBd'] = this.nombreBd;


      this.coreService.insertDatosEstablecimiento(sendDatosEstablecimiento, this.tokenValidate).subscribe({
        next: (data: any) =>{
          dialogRef.close();

          this.toastr.success('Datos Actualizados', '', {
            timeOut: 3000,
            closeButton: true
          });

          this.resetControlsForm();
        },
        error: (error) => {
          console.log('error response update data: ' + error);

          this.toastr.error('error al insertar datos', '', {
            timeOut: 3000,
            closeButton: true
          });

          dialogRef.close();
          this.loading = false;
        }

      });
    }

  }

  actualizarDatosEmpresa(sendDatosEstablecimiento: any): void{
    if(this.sendDatosEmpresaForm.invalid){
      return;
    }

    let dialogRef = this.loadingService.open();

    sendDatosEstablecimiento['idEmpresa'] = this.idEmpresa;
    sendDatosEstablecimiento['ruc'] = `${this.rucEmpresa}${this.sendDatosEmpresaForm.controls['establecimiento'].value}`;
    sendDatosEstablecimiento['nombreBd'] = this.nombreBd;
    sendDatosEstablecimiento['idEstablecimiento'] = this.idEstablecimientoEdit;

    if(this.base64 && this.imgExtensionFile){
      sendDatosEstablecimiento['img_base64'] = `data:image/${this.imgExtensionFile};base64,${this.base64}`;
      sendDatosEstablecimiento['extensionFile'] = this.imgExtensionFile;
    }else{
      sendDatosEstablecimiento['img_base64'] = ``;
    }


    this.coreService.actualizarDatosEstablecimiento(sendDatosEstablecimiento, this.tokenValidate).subscribe({
      next: (data: any) =>{
        dialogRef.close();

        this.toastr.success('Datos Actualizados', '', {
          timeOut: 3000,
          closeButton: true
        });

        setTimeout(() => {
          this.router.navigate(['/establecimientos']);
        }, 600);

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

  private getLogoEstablecimiento(numeroEstablecimiento: string): void{
    let nameLogoEstablecimiento = `${this.rucEmpresa}${numeroEstablecimiento}`;
    this.coreService.getImagenLogoByRucEmp(nameLogoEstablecimiento, this.tokenValidate).subscribe({
      next: (data: any) => {
        let objectURL = URL.createObjectURL(data);       
        this.imgURL = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      error: (error : any) => {
        console.log('inside error logo');
      }
    });
  }

  private getEstablecimientoById(idEstablecimiento: number){
    let dialogRef = this.loadingService.open();


    this.coreService.getEstablecimientoByIdEmp(this.idEmpresa, idEstablecimiento, this.nombreBd, this.tokenValidate).subscribe({
        next: (data: any) =>{
          dialogRef.close();
        
          let dataEstablecimiento = data.data[0];
          if(!data.data){
            this.router.navigate(['/establecimientos']);
            return;
          }

          this.sendDatosEmpresaForm.controls['establecimiento'].setValue(dataEstablecimiento['cone_establecimiento']);
          this.sendDatosEmpresaForm.controls['nombreEmpresa'].setValue(dataEstablecimiento['cone_nombre_establecimiento']);
          this.sendDatosEmpresaForm.controls['direccion'].setValue(dataEstablecimiento['cone_direccion_sucursal']);
          this.sendDatosEmpresaForm.controls['telefono'].setValue(dataEstablecimiento['cone_telefonos_sucursal']);
        },
        error: (error) => {
          dialogRef.close();
        }
    });
  }


  private resetControlsForm(){
    this.sendDatosEmpresaForm.controls['establecimiento'].setValue('');
    this.sendDatosEmpresaForm.controls['nombreEmpresa'].setValue('');
    this.sendDatosEmpresaForm.controls['direccion'].setValue('');
    this.sendDatosEmpresaForm.controls['telefono'].setValue('');
    
    this.base64 = '';
    this.imgExtensionFile = '';
    this.imgURL = '';

    this.ref.detectChanges();
  }
}
