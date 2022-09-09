import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';
import nacionalidad from '../../../assets/nacionalidad.json';
import {ToastrService} from 'ngx-toastr';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { LocalService } from 'src/app/services/local.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-cliente',
  templateUrl: './nuevo-cliente.component.html',
  styleUrls: ['./nuevo-cliente.component.css']
})
export class NuevoClienteComponent implements OnInit, AfterViewInit{

  tiposId = [
    {valor: 'RUC', valorMostrar: 'RUC'},
    {valor: 'CI', valorMostrar: 'CI'}
  ]

  nacionalidades = nacionalidad;
  sendDatosFormCliente : FormGroup;

  idClienteEdit: number = 0;
  idEmpresa: number = 0;
  rucEmpresa: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  loading = false;

  editMode = false;
  titlePage = 'Nuevo Cliente'

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
              private localService: LocalService,
              private route: ActivatedRoute,
              private router: Router,
              private ref: ChangeDetectorRef) { 

    this.sendDatosFormCliente = this.formBuilder.group({
      tipoIdentificacion: ['', Validators.required],
      documentoIdentidad: [ '', [Validators.maxLength(13), Validators.minLength(10), Validators.required]],
      nacionalidad: ['', [Validators.required]],
      nombreNatural: ['', Validators.required],
      razonSocial: [ ''],
      email: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      fechaNacimiento: [''],
      telefonos: [''],
      celular: [''],
      direccion: [''],
      profesion: [''],
      comentario: ['']
    });
    
  }
  ngAfterViewInit(): void {
    this.identificacionInput.nativeElement.focus();
    this.ref.detectChanges();
  }

  ngOnInit(): void {

    // GET INITIAL DATA 
    const localServiceResponseToken = this.localService.storageGetJsonValue('DATA_TOK');
    const localServiceResponseUsr = this.localService.storageGetJsonValue('DATA_USER');

    this.dataUser = localServiceResponseToken;
    const { token, expire } = this.dataUser;
    this.tokenValidate = { token, expire};

    this.idEmpresa = localServiceResponseUsr._bussId;
    this.rucEmpresa = localServiceResponseUsr._ruc;

    this.route.paramMap.subscribe((params: any) => {

        let idCliente = params.get('id');
        this.idClienteEdit = idCliente;
        if(idCliente){
          this.editMode = true;
          this.titlePage = 'Editar Cliente';
          this.getClienteById(idCliente);

        }else{

          this.sendDatosFormCliente.controls['tipoIdentificacion'].setValue(this.tiposId[1].valor);

          const indexDefaultCountry = this.nacionalidades.indexOf('Ecuador');
          this.sendDatosFormCliente.controls['nacionalidad'].setValue(this.nacionalidades[indexDefaultCountry]);

          const actualDate = new Date();
          this.sendDatosFormCliente.controls['fechaNacimiento'].setValue(actualDate);

        }

    });

  }

  private getClienteById(idCliente: any){
    let dialogRef = this.loadingService.open();

    this.coreService.getClienteByIdClienteIdEmp(idCliente, this.idEmpresa, this.tokenValidate).subscribe({
        next: (data: any) =>{
          dialogRef.close();

          if(!data.data){
            this.router.navigate(['/clientes']);
            return;
          }

          const datosCliente = data.data[0];
          this.sendDatosFormCliente.controls['documentoIdentidad'].setValue(datosCliente['cli_documento_identidad']);
          this.sendDatosFormCliente.controls['nombreNatural'].setValue(datosCliente['cli_nombres_natural']);
          this.sendDatosFormCliente.controls['razonSocial'].setValue(datosCliente['cli_razon_social']);
          this.sendDatosFormCliente.controls['email'].setValue(datosCliente['cli_email']);

          const fechaNacimiento = new Date(datosCliente['cli_fecha_nacimiento']);
          this.sendDatosFormCliente.controls['fechaNacimiento'].setValue(fechaNacimiento);
          this.sendDatosFormCliente.controls['telefonos'].setValue(datosCliente['cli_teleono']);
          this.sendDatosFormCliente.controls['celular'].setValue(datosCliente['cli_celular']);
          this.sendDatosFormCliente.controls['direccion'].setValue(datosCliente['cli_direccion']);
          this.sendDatosFormCliente.controls['profesion'].setValue(datosCliente['cli_profesion']);
          this.sendDatosFormCliente.controls['comentario'].setValue(datosCliente['cli_observacion']);

          const indexDefaultCountry = this.nacionalidades.indexOf(datosCliente['cli_nacionalidad']);
          this.sendDatosFormCliente.controls['nacionalidad'].setValue(this.nacionalidades[indexDefaultCountry]);

          this.sendDatosFormCliente.controls['tipoIdentificacion'].setValue(datosCliente['cli_tipo_documento_identidad']);
        },
        error: (error) => {
          dialogRef.close();
        }
    });
  }


  saveDatosCliente(sendDatosCliente: any){
    
    if(this.sendDatosFormCliente.invalid){
      this.loading = false;

      this.toastr.error('verifique que los datos esten llenos', '', {
          timeOut: 3000,
          closeButton: true
        });

      return;
    }

    const validCiRuc = this.validateCiEcuador(sendDatosCliente.documentoIdentidad, sendDatosCliente.nacionalidad);

    if(validCiRuc){

      const selectedDate: Date = new Date(sendDatosCliente['fechaNacimiento']);
      const dateString = '' + selectedDate.getFullYear() + '-' + ('0' + (selectedDate.getMonth()+1)).slice(-2) + 
                          '-' + ('0' + selectedDate.getDate()).slice(-2) ;

      sendDatosCliente['idEmpresa'] = this.idEmpresa;
      sendDatosCliente['fechaNacimiento'] = dateString;

      if(this.editMode){
        sendDatosCliente['idCliente'] = this.idClienteEdit;
        this.updateDatosClienteApi(sendDatosCliente);
      }else{
        this.insertDatosClienteApi(sendDatosCliente);
      }

    }else{
      this.toastr.error('Identificacion incorrecta', '', {
        timeOut: 3000,
        closeButton: true
      });

      return;
    }

  }

  private insertDatosClienteApi(sendFormCliente: any){
    let overlayRef = this.loadingService.open();

    this.coreService.insertClienteToBD(sendFormCliente, this.tokenValidate).subscribe({
      next: (data: any) => {

        overlayRef.close();
        if(data.code == 400){
          return;
        }

        this.toastr.success('Cliente Guardado', '', {
          timeOut: 3000,
          closeButton: true
        });

        setTimeout(() => {
          this.router.navigate(['/clientes']);
        }, 600);

        //this.resetControlsForm();
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

  private updateDatosClienteApi(sendFormCliente: any){
    let overlayRef = this.loadingService.open();

    this.coreService.updateClienteToBD(sendFormCliente, this.tokenValidate).subscribe({
      next: (data: any) => {

        overlayRef.close();
        if(data.code == 400){
          return;
        }

        this.toastr.success('Cliente Actualizado', '', {
          timeOut: 3000,
          closeButton: true
        });

        setTimeout(() => {
          this.router.navigate(['/clientes']);
        }, 600);
        //this.resetControlsForm();
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

  searchDatosClienteSri(identificacion: any){
    if(identificacion.length == 10){
      this.sendDatosFormCliente.controls['tipoIdentificacion'].setValue(this.tiposId[1].valor);
    }
    if(identificacion.length == 13){
      this.sendDatosFormCliente.controls['tipoIdentificacion'].setValue(this.tiposId[0].valor);
    }

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
          this.sendDatosFormCliente.controls['nombreNatural'].setValue(dataArray[1]);
          this.sendDatosFormCliente.controls['direccion'].setValue(dataArray[dataArray.length - 2]);
        }else{
          this.sendDatosFormCliente.controls['nombreNatural'].setValue(dataArray[1]);
          this.sendDatosFormCliente.controls['direccion'].setValue(dataArray[dataArray.length - 2]);
          this.sendDatosFormCliente.controls['comentario'].setValue(dataArray[dataArray.length - 3]);
        }

        dialogRef.close();
      },
      error: (err) => {
        dialogRef.close();
      }

   });

  }

  private validateCiEcuador(identificacion: string, nacionalidad: string): boolean{

    if(identificacion.length == 10 && nacionalidad === 'Ecuador'){

      /*let suma = 0;

      for(let numero of identificacion){
        
        let numberInt: number = +numero;
        if((numberInt + 1) % 2 === 0){

        }


      }*/

      return true;
    }
    return true;
  }


  private resetControlsForm(){
    this.sendDatosFormCliente.controls['documentoIdentidad'].setValue('');
    this.sendDatosFormCliente.controls['nombreNatural'].setValue('');
    this.sendDatosFormCliente.controls['razonSocial'].setValue('');
    this.sendDatosFormCliente.controls['email'].setValue('');
    this.sendDatosFormCliente.controls['telefonos'].setValue('');
    this.sendDatosFormCliente.controls['celular'].setValue('');
    this.sendDatosFormCliente.controls['direccion'].setValue('');
    this.sendDatosFormCliente.controls['profesion'].setValue('');
    this.sendDatosFormCliente.controls['comentario'].setValue('');

    this.sendDatosFormCliente.controls['tipoIdentificacion'].setValue(this.tiposId[1].valor);

    const indexDefaultCountry = this.nacionalidades.indexOf('Ecuador');
    this.sendDatosFormCliente.controls['nacionalidad'].setValue(this.nacionalidades[indexDefaultCountry]);

    const actualDate = new Date();
    this.sendDatosFormCliente.controls['fechaNacimiento'].setValue(actualDate);

  }

  cancelarClick(){
    this.router.navigate(['/clientes']);
  }
}
