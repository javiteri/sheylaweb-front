import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/loading.service';
import nacionalidad from '../../../assets/nacionalidad.json'
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-nuevo-cliente',
  templateUrl: './nuevo-cliente.component.html',
  styleUrls: ['./nuevo-cliente.component.css']
})
export class NuevoClienteComponent implements OnInit {

  tiposId = [
    {valor: 'RUC', valorMostrar: 'RUC'},
    {valor: 'CEDULA', valorMostrar: 'CI'}
  ]

  nacionalidades = nacionalidad;

  sendDatosFormCliente : FormGroup;

  constructor(private formBuilder: FormBuilder,
              private coreService: ApplicationProvider,
              private loadingService: LoadingService,
              private toastr: ToastrService) { 

    this.sendDatosFormCliente = this.formBuilder.group({
      tipoIdentificacion: ['', Validators.required],
      documentoIdentidad: [ '', Validators.required],
      nacionalidad: ['', Validators.required],
      nombreNatural: ['', Validators.required],
      razonSocial: [ '', Validators.required],
      email: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      telefonos: ['', Validators.required],
      celular: ['', Validators.required],
      direccion: ['', Validators.required],
      profesion: ['', Validators.required],
      comentario: ['', Validators.required]
    });

  }

  ngOnInit(): void {

    this.sendDatosFormCliente.controls['tipoIdentificacion'].setValue(this.tiposId[0].valor);

    const indexDefaultCountry = this.nacionalidades.indexOf('Ecuador');
    this.sendDatosFormCliente.controls['nacionalidad'].setValue(this.nacionalidades[indexDefaultCountry]);
  }


  saveDatosCliente(sendDatosCliente: any){
    console.log('inside save datos cliente');
    console.log(sendDatosCliente);
  }

  searchDatosClienteSri(identificacion: any){
    this.searchDatosCliente(identificacion);
  }


  onLostFocus(documentoIdentidad: string){

    if(documentoIdentidad.length == 10 || documentoIdentidad.length == 13){
      console.log('inside lost focus: ' + documentoIdentidad);
      this.searchDatosCliente(documentoIdentidad);
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
        console.log('errror service client: ' + err.message);
        dialogRef.close();
      }

   });

  }
}
