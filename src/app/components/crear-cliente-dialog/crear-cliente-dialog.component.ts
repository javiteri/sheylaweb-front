import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';
import { Event as NavigationEvent } from '@angular/router';

import nacionalidad from '../../assets/nacionalidad.json';

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
    private router: Router) { 

      this.sendDatosFormCliente = this.formBuilder.group({
        tipoIdentificacion: ['', Validators.required],
        documentoIdentidad: [ '', [Validators.maxLength(13), Validators.minLength(10), Validators.required]],
        nacionalidad: [''],
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

      router.events.pipe(
        filter((event: NavigationEvent) => {
          return (event instanceof NavigationEnd);
        })
      ).subscribe((event: NavigationEvent) => {
          
          console.log("back button press");
      });
  }

  ngOnInit(): void {
    console.log('inside dialog component');
  }

  nuevoCliente(){
    
  }

  saveDatosCliente(sendDatosCliente: any){
    
    /*if(this.sendDatosFormCliente.invalid){
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
    }*/

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
  
}
