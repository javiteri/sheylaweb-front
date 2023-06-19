import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';

import nacionalidad from '../../assets/nacionalidad.json';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ToastrService } from 'ngx-toastr';


export interface DialogNuevoClienteData {
  identificacion: string;
}


@Component({
  selector: 'app-crear-cliente-dialog',
  templateUrl: './crear-cliente-dialog.component.html',
  styleUrls: ['./crear-cliente-dialog.component.css']
})
export class CrearClienteDialogComponent implements OnInit, AfterViewInit {

  tiposId = [
    {valor: 'RUC', valorMostrar: 'RUC'},
    {valor: 'CI', valorMostrar: 'CI'}
  ]

  nacionalidades = nacionalidad;
  sendDatosFormCliente : FormGroup;

  idClienteEdit: number = 0;
  idEmpresa: number = 0;
  rucEmpresa: string = '';
  nombreBd: string = '';
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
    public matDialogRef: MatDialogRef<CrearClienteDialogComponent>,
    private toastr: ToastrService,
    private ref: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogNuevoClienteData
    ) { 

      this.sendDatosFormCliente = this.formBuilder.group({
        tipoIdentificacion: ['', Validators.required],
        documentoIdentidad: [ '', [Validators.maxLength(13), Validators.minLength(10), Validators.required]],
        nacionalidad: ['', [Validators.required]],
        nombreNatural: ['', Validators.required],
        razonSocial: [ ''],
        email: ['', [Validators.email]],
        fechaNacimiento: ['', [Validators.required]],
        telefonos: [''],
        celular: [''],
        direccion: [''],
        profesion: [''],
        comentario: ['']
      });

  }
  ngAfterViewInit(): void {
    const regexOnlyNumber = new RegExp(/^\d{10,13}$/);
    if(this.dialogData && regexOnlyNumber.test(this.dialogData['identificacion'])){
      console.log('identificacion');
      console.log(this.dialogData['identificacion']);
      this.sendDatosFormCliente.controls['documentoIdentidad'].setValue(this.dialogData['identificacion']);

      this.identificacionInput.nativeElement.focus();
      this.ref.detectChanges();

      this.searchDatosCliente(this.sendDatosFormCliente.controls['documentoIdentidad'].value);
    }
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

    this.sendDatosFormCliente.controls['tipoIdentificacion'].setValue(this.tiposId[1].valor);
    
    const indexDefaultCountry = this.nacionalidades.indexOf('Ecuador');
    this.sendDatosFormCliente.controls['nacionalidad'].setValue(this.nacionalidades[indexDefaultCountry]);

    const actualDate = new Date();
    this.sendDatosFormCliente.controls['fechaNacimiento'].setValue(actualDate);

    
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
      sendDatosCliente['nombreBd'] = this.nombreBd;

      this.insertDatosClienteApi(sendDatosCliente);

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

    this.coreService.searchClienteByCiRucApi(this.tokenValidate, identificacion).subscribe({
      next: (res: any) => {
        try{
          const dataArray = res['data'].split(/\*+|\$+/);

          if(dataArray.length >= 12){
            this.sendDatosFormCliente.controls['nombreNatural'].setValue(dataArray[1]);
            this.sendDatosFormCliente.controls['direccion'].setValue(dataArray[dataArray.length - 2]);
          }else{
            this.sendDatosFormCliente.controls['nombreNatural'].setValue(dataArray[1]);
            this.sendDatosFormCliente.controls['direccion'].setValue(dataArray[dataArray.length - 2]);
            this.sendDatosFormCliente.controls['comentario'].setValue(dataArray[dataArray.length - 3]);
          }
        }catch(exception){}

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

  cancelarClick(){
    this.matDialogRef.close();
  }
}
