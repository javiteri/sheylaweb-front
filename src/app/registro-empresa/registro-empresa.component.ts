import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationProvider } from '../providers/provider';

import {TokenValidate} from '../interfaces/IWebData';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro-empresa',
  templateUrl: './registro-empresa.component.html',
  styleUrls: ['./registro-empresa.component.css']
})
export class RegistroEmpresaComponent implements OnInit {

  sendDatosEmpresaForm: FormGroup;

  idEmpresa: number = 0;
  rucEmpresa: string = '';

  empresaData: any;

  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private coreService: ApplicationProvider,
    public router: Router
    ) { 

      this.sendDatosEmpresaForm = this.formBuilder.group({
        ruc: [{value: '', disabled: true}, Validators.required],
        nombreEmpresa: ['', Validators.required],
        razonSocial: ['', Validators.required],
        fechaInicio: ['', Validators.required],
        eslogan: ['', Validators.required],
        web: ['', Validators.required],
        email: ['', Validators.required],
        telefonos: ['', Validators.required],
        direccionMatriz: ['', Validators.required],
        propietario: ['', Validators.required],
        Comentario: ['', Validators.required]
      });
    }


  ngOnInit(): void {

    this.dataUser = JSON.parse(localStorage.getItem('DATA_USER')!);
    const { token, expire } = this.dataUser;
    this.tokenValidate = { token, expire};

    this.route.paramMap.subscribe((params: any) => {

        this.idEmpresa = params.get('id');
        this.rucEmpresa = params.get('ruc');

        let postData = {
          ruc: this.rucEmpresa,
          idEmpresa: this.idEmpresa
        } 


        this.coreService.empresaByRucAndId(postData, this.tokenValidate).subscribe({
          next: (result) => {
            

            this.empresaData = result.data[0];

            console.log(this.empresaData);

            this.sendDatosEmpresaForm.controls['ruc'].setValue(this.empresaData['ruc']);
            this.sendDatosEmpresaForm.controls['nombreEmpresa'].setValue(this.empresaData['nombreEmp']);
            this.sendDatosEmpresaForm.controls['razonSocial'].setValue(this.empresaData['razonSocial']);
            this.sendDatosEmpresaForm.controls['fechaInicio'].setValue(this.empresaData['fechaInicio']);
            this.sendDatosEmpresaForm.controls['eslogan'].setValue(this.empresaData['slogan']);
            this.sendDatosEmpresaForm.controls['web'].setValue(this.empresaData['web']);
            this.sendDatosEmpresaForm.controls['email'].setValue(this.empresaData['email']);
            this.sendDatosEmpresaForm.controls['telefonos'].setValue(this.empresaData['telefono']);
            this.sendDatosEmpresaForm.controls['direccionMatriz'].setValue(this.empresaData['direccionMatriz']);
            this.sendDatosEmpresaForm.controls['propietario'].setValue(this.empresaData['propietario']);
            this.sendDatosEmpresaForm.controls['Comentario'].setValue(this.empresaData['comentarios']);

          },
          error: (error) => {

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


    });

  }

}
