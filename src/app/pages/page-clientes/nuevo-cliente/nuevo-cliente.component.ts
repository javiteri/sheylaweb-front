import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationProvider } from 'src/app/providers/provider';
import nacionalidad from '../../../assets/nacionalidad.json'

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
    private coreService: ApplicationProvider) { 

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


  }


  saveDatosCliente(sendDatosCliente: any){
    console.log('inside save datos cliente');
    console.log(sendDatosCliente);
  }

  searchDatosClienteSri(identificacion: any){
    if(identificacion){
     /*this.coreService.searchClienteByCiRuc(identificacion).subscribe({
        next: (res) => {
          console.log('response service client: ' + res);
        },
        error: (err) => {
          console.log('errror service client: ' + err);
        }

     });*/
    }
    console.log('inside search datos Cliente: ' + identificacion['documentoIdentidad'] );
  }
}
