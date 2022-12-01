import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.css']
})
export class NuevoUsuarioComponent implements OnInit, AfterViewInit {

  sendDatosFormUsuario : FormGroup;

  idUsuarioEdit: number = 0;
  idEmpresa: number = 0;
  rucEmpresa: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  editMode = false;
  titlePage = 'Nuevo Usuario'

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
              private route: ActivatedRoute,
              private router: Router,
              private ref: ChangeDetectorRef,
              private location: Location) { 

    this.sendDatosFormUsuario = this.formBuilder.group({
      identificacion: ['', Validators.required],
      nombreNatural: ['', [Validators.required, Validators.maxLength(250)]],
      telefono: ['', [Validators.required,Validators.maxLength(250)]],
      direccion: ['', [Validators.required,Validators.maxLength(250)]],
      email: ['', [Validators.maxLength(250), Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      fechaNacimiento: [''],
      nombreUsuario: ['', [Validators.required, Validators.maxLength(250)]],
      password: ['', [Validators.required, Validators.maxLength(250)]],
      permisoEscritura: [false]
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

      let idUsuario = params.get('id');
      this.idUsuarioEdit = idUsuario;
      if(idUsuario){
        this.editMode = true;
        this.titlePage = 'Editar Usuario';
        this.getUsuarioById(idUsuario, this.idEmpresa);

      }else{

        const actualDate = new Date();
        this.sendDatosFormUsuario.controls['fechaNacimiento'].setValue(actualDate);

      }

  });

  }


  onLostFocus(identificacion: string){

    if(identificacion.length == 10 || identificacion.length == 13){
      this.searchDatosCliente(identificacion);
    }

  }

  searchDatosClienteSri(identificacion: any){
    if(identificacion.length == 10 || identificacion.length == 13){
        this.searchDatosCliente(identificacion);
    }
  }

  private searchDatosCliente(identificacion: any){

    let dialogRef = this.loadingService.open();

    this.coreService.searchClienteByCiRuc(identificacion).subscribe({
      next: (res) => {
        const dataArray = res.split(/\*+|\$+/);

        if(dataArray.length >= 12){
          this.sendDatosFormUsuario.controls['nombreNatural'].setValue(dataArray[1]);
          this.sendDatosFormUsuario.controls['direccion'].setValue(dataArray[dataArray.length - 2]);
        }else{
          this.sendDatosFormUsuario.controls['nombreNatural'].setValue(dataArray[1]);
          this.sendDatosFormUsuario.controls['direccion'].setValue(dataArray[dataArray.length - 2]);
          //this.sendDatosFormUsuario.controls['comentario'].setValue(dataArray[dataArray.length - 3]);
        }

        dialogRef.close();
      },
      error: (err) => {
        dialogRef.close();
      }

   });
  }

  private getUsuarioById(idUser: any, idEmpresa: any){
    let dialogRef = this.loadingService.open();

    this.coreService.getUsuarioById(idUser,idEmpresa, this.tokenValidate).subscribe({
        next: (data: any) =>{
          dialogRef.close();

          const datosUsuario = data.data[0];
          this.sendDatosFormUsuario.controls['identificacion'].setValue(datosUsuario['usu_identificacion']);
          this.sendDatosFormUsuario.controls['nombreNatural'].setValue(datosUsuario['usu_nombres']);
          this.sendDatosFormUsuario.controls['telefono'].setValue(datosUsuario['usu_telefonos']);
          this.sendDatosFormUsuario.controls['direccion'].setValue(datosUsuario['usu_direccion']);

          const fechaNacimiento = new Date(datosUsuario['usu_fecha_nacimiento']);
          this.sendDatosFormUsuario.controls['fechaNacimiento'].setValue(fechaNacimiento);
          this.sendDatosFormUsuario.controls['email'].setValue(datosUsuario['usu_mail']);
          this.sendDatosFormUsuario.controls['nombreUsuario'].setValue(datosUsuario['usu_username']);
          this.sendDatosFormUsuario.controls['password'].setValue(datosUsuario['usu_password']);
          this.sendDatosFormUsuario.controls['permisoEscritura'].setValue(datosUsuario['usu_permiso_escritura']);

          if(datosUsuario['usu_username'].toUpperCase() == 'ADMIN' && datosUsuario['usu_password'].toUpperCase() == 'ADMIN'){
            this.toastr.info('Le recomendamos que por seguridad modifique los datos del usuario por defecto', '', {
              timeOut: 4000,
              closeButton: true
            });
          }
        },
        error: (error) => {
          dialogRef.close();
        }
    });
  }


  saveDatosUsuario(sendDatosUsuario: any){

    if(this.sendDatosFormUsuario.invalid){

      this.toastr.error('verifique que los datos esten llenos', '', {
          timeOut: 3000,
          closeButton: true
        });

      return;
    }

    const selectedDate: Date = new Date(sendDatosUsuario['fechaNacimiento']);
    const dateString = '' + selectedDate.getFullYear() + '-' + ('0' + (selectedDate.getMonth()+1)).slice(-2) + 
                          '-' + ('0' + selectedDate.getDate()).slice(-2);

    sendDatosUsuario['idEmpresa'] = this.idEmpresa;
    sendDatosUsuario['fechaNacimiento'] = dateString;

    if(this.editMode){
      sendDatosUsuario['idUsuario'] = this.idUsuarioEdit;
      this.updateDatosUsuarioBD(sendDatosUsuario);
    }else{
      this.insertDatosUsuarioBD(sendDatosUsuario);
    }

  }


  private insertDatosUsuarioBD(sendDatosUsuario: any): void{

    let overlayRef = this.loadingService.open();
    this.coreService.insertUsuarioToBD(sendDatosUsuario, this.tokenValidate).subscribe({
      next: (data: any) => {
        overlayRef.close();

        if(data.code == 400){
          return;
        }

        this.toastr.success('Usuario Guardado', '', {
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

  private updateDatosUsuarioBD(sendFormUsuario: any){
    let overlayRef = this.loadingService.open();

    this.coreService.updateUsuarioToBD(sendFormUsuario, this.tokenValidate).subscribe({
      next: (data: any) => {

        overlayRef.close();
        if(data.code == 400){
          return;
        }

        this.toastr.success('Usuario Actualizado', '', {
          timeOut: 3000,
          closeButton: true
        });

        setTimeout(() => {
          this.router.navigate(['/usuarios']);
        }, 600);
     
      },
      error: (error) => {
        overlayRef.close();

        console.log('inside error update usuario');
        this.toastr.error(error.error.message, '', {
          timeOut: 3000,
          closeButton: true
        });
      }
    });
  }
  
  
  private resetControlsForm(){
    this.sendDatosFormUsuario.controls['identificacion'].setValue('');
    this.sendDatosFormUsuario.controls['nombreNatural'].setValue('');
    this.sendDatosFormUsuario.controls['telefono'].setValue('');
    this.sendDatosFormUsuario.controls['direccion'].setValue('');
    this.sendDatosFormUsuario.controls['email'].setValue('');
    const actualDate = new Date();
    this.sendDatosFormUsuario.controls['fechaNacimiento'].setValue(actualDate);
    this.sendDatosFormUsuario.controls['nombreUsuario'].setValue('');
    this.sendDatosFormUsuario.controls['password'].setValue('');
    this.sendDatosFormUsuario.controls['permisoEscritura'].setValue('');

    this.identificacionInput.nativeElement.focus();
    this.ref.detectChanges();
  }

  cancelarClick(){
    this.location.back();
  }

}
