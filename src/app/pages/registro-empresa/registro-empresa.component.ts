import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationProvider } from '../../providers/provider';

import {TokenValidate} from '../../interfaces/IWebData';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataStoreService } from 'src/app/services/DataStore.Service';
import { DataStoreGlobalModel } from 'src/app/interfaces/DataStoreGlobalModel';
import { LocalService } from 'src/app/services/local.service';
import { LoadingService } from 'src/app/services/Loading.service';
import {ToastrService} from 'ngx-toastr';

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

  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private coreService: ApplicationProvider,
    public router: Router,
    private dataStoreService: DataStoreService,
    private localService: LocalService,
    private loadingService: LoadingService,
    private toastr: ToastrService
    ) {

      this.sendDatosEmpresaForm = this.formBuilder.group({
        ruc: [{value: '', disabled: true}, Validators.required],
        nombreEmpresa: ['', [Validators.required, Validators.maxLength(250), Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
        razonSocial: ['', [Validators.required, Validators.maxLength(250), Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
        fechaInicio: [''],
        eslogan: ['', [Validators.maxLength(250)]],
        web: ['', [Validators.maxLength(250)]],
        email: ['', [Validators.required, Validators.maxLength(250), Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        telefonos: ['', [Validators.required, Validators.maxLength(250), Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
        direccionMatriz: ['', [Validators.required, Validators.maxLength(250), Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
        sucursal1: ['', [Validators.maxLength(250)]],
        sucursal2: ['', [Validators.maxLength(250)]],
        sucursal3: ['', [Validators.maxLength(250)]],
        propietario: ['', [Validators.required, Validators.maxLength(250)]],
        comentario: ['', [Validators.maxLength(250)]]
      });

    }


  ngOnInit(): void {

    const localServiceResponseToken = this.localService.storageGetJsonValue('DATA_TOK');
    const localServiceResponseUsr = this.localService.storageGetJsonValue('DATA_USER');

    this.dataUser = localServiceResponseToken;
    const { token, expire } = this.dataUser;
    this.tokenValidate = { token, expire};

    this.idEmpresa = localServiceResponseUsr._bussId;
    this.rucEmpresa = localServiceResponseUsr._ruc;

    console.log('idEmpresa: ' + localServiceResponseUsr._bussId);
    console.log('rucEmpresa: ' + localServiceResponseUsr._ruc);

    let postData = {
      ruc: this.rucEmpresa,
      idEmpresa: this.idEmpresa
    }
    this.getDatosEmpresa(postData, this.tokenValidate);

    /*this.route.paramMap.subscribe((params: any) => {

        this.idEmpresa = params.get('id');
        this.rucEmpresa = params.get('ruc');

        let postData = {
          ruc: this.rucEmpresa,
          idEmpresa: this.idEmpresa
        }

        this.getDatosEmpresa(postData, this.tokenValidate);
    });*/


    //subscribe to observer dataStoreGlobalState
    /*this.dataStoreService.globalModel$.subscribe((dataStoreGLobalModel: DataStoreGlobalModel) => {

      if(dataStoreGLobalModel){
          console.log('idEmpresaDataStore: ' + dataStoreGLobalModel.idEmpresa);
          console.log('idUsuarioDataStore: ' + dataStoreGLobalModel.idUser);
          console.log('rucEmpresaDataStore: ' + dataStoreGLobalModel.rucEmpresa);

          this.rucEmpresa = dataStoreGLobalModel.rucEmpresa;
          this.idEmpresa = dataStoreGLobalModel.idEmpresa;

          let postData = {
            ruc: this.rucEmpresa,
            idEmpresa: this.idEmpresa
          }

          this.getDatosEmpresa(postData, this.tokenValidate);
      }

    });*/
  }


  private getDatosEmpresa(postData: any, accesToken: any ){

    let dialogRef = this.loadingService.open();

    this.loading = true;

    this.coreService.empresaByRucAndId(postData, accesToken).subscribe({
      next: (result) => {

        dialogRef.close();

        if(result.error){
          console.log(result.error);
          return;
        }

        this.empresaData = result.data[0];

        this.sendDatosEmpresaForm.controls['ruc'].setValue(this.empresaData['ruc']);
        this.sendDatosEmpresaForm.controls['nombreEmpresa'].setValue(this.empresaData['nombreEmp']);
        this.sendDatosEmpresaForm.controls['razonSocial'].setValue(this.empresaData['razonSocial']);
        this.sendDatosEmpresaForm.controls['fechaInicio'].setValue(this.empresaData['fechaInicio']);
        this.sendDatosEmpresaForm.controls['eslogan'].setValue(this.empresaData['slogan']);
        this.sendDatosEmpresaForm.controls['web'].setValue(this.empresaData['web']);
        this.sendDatosEmpresaForm.controls['email'].setValue(this.empresaData['email']);
        this.sendDatosEmpresaForm.controls['telefonos'].setValue(this.empresaData['telefono']);
        this.sendDatosEmpresaForm.controls['direccionMatriz'].setValue(this.empresaData['direccionMatriz']);
        this.sendDatosEmpresaForm.controls['sucursal1'].setValue(this.empresaData['direccionSucursal1']);
        this.sendDatosEmpresaForm.controls['sucursal2'].setValue(this.empresaData['direccionSucursal2']);
        this.sendDatosEmpresaForm.controls['sucursal3'].setValue(this.empresaData['direccionSucursal3']);
        this.sendDatosEmpresaForm.controls['propietario'].setValue(this.empresaData['propietario']);
        this.sendDatosEmpresaForm.controls['comentario'].setValue(this.empresaData['comentarios']);

        this.loading = false;
      },
      error: (error) => {

        dialogRef.close();

        this.loading = false;

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

  }


  // SEND DATA TO SERVER
  updateDatosEmpresa(sendDatosEmpresaForm: any){

    
    this.loading = true;

    if(this.sendDatosEmpresaForm.invalid){
        this.loading = false;
        return;
    }

    let dialogRef = this.loadingService.open();

    const selectedDate: Date = new Date(sendDatosEmpresaForm['fechaInicio']);
    const dateString = '' + selectedDate.getFullYear() + '-' + ('0' + (selectedDate.getMonth()+1)).slice(-2) + '-' + ('0' + selectedDate.getDate()).slice(-2) ;

    sendDatosEmpresaForm['idEmpresa'] = this.idEmpresa;
    sendDatosEmpresaForm['fechaInicio'] = dateString;

    this.coreService.updateDatosEmpresa(sendDatosEmpresaForm, this.tokenValidate).subscribe({
      next: (data: any) =>{
        dialogRef.close();

        this.toastr.success('Datos Actualizados', '', {
          timeOut: 3000,
          closeButton: true
        });

        console.log('Datos Actualizados');

        this.loading = false;
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
}
