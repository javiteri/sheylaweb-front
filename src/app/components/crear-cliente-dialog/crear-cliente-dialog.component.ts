import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';
import { Event as NavigationEvent } from '@angular/router';

import nacionalidad from '../../assets/nacionalidad.json';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-crear-cliente-dialog',
  templateUrl: './crear-cliente-dialog.component.html',
  styleUrls: ['./crear-cliente-dialog.component.css']
})
export class CrearClienteDialogComponent implements OnInit {

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

  constructor(private formBuilder: FormBuilder,
    private coreService: ApplicationProvider,
    private loadingService: LoadingService,
    public matDialogRef: MatDialogRef<CrearClienteDialogComponent>,
    private toastr: ToastrService,
    private localService: LocalService
    ) { 

      this.sendDatosFormCliente = this.formBuilder.group({
        tipoIdentificacion: ['', Validators.required],
        documentoIdentidad: [ '', [Validators.maxLength(13), Validators.minLength(10), Validators.required]],
        nacionalidad: ['', [Validators.required]],
        nombreNatural: ['', Validators.required],
        razonSocial: [ ''],
        email: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        fechaNacimiento: ['', [Validators.required]],
        telefonos: [''],
        celular: [''],
        direccion: [''],
        profesion: [''],
        comentario: ['']
      });

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
  }

  nuevoCliente(){
    
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
}
