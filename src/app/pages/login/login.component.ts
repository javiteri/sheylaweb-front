import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationProvider } from '../../providers/provider';
import { DataStoreService } from '../../services/DataStore.Service';
import { DataStoreGlobalModel } from '../../interfaces/DataStoreGlobalModel';
import { LocalService } from '../../services/local.service';
import { LoadingService } from '../../services/Loading.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  sendLoginForm: FormGroup
  loading = false;

  showTextMessageInfo = false;
  textMessage = '';

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    private coreService: ApplicationProvider,
    private localService: LocalService,
    private loadingService: LoadingService,
    private toastr: ToastrService
  ) {

    this.sendLoginForm = this.formBuilder.group({
      ruc: ['', Validators.required],
      user: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  ngOnInit(): void {
  }


  login(sendFormData: any){

    this.loading = true;

    if (this.sendLoginForm.invalid) {
        this.loading = false;

        /*this.toastr.error('verifique que los datos esten llenos', '', {
            timeOut: 3000,
            closeButton: true
        });*/

        this.showMessageInfo('verifique que los datos esten llenos');
        return;
    }

    this.inicioSesionApi(sendFormData);
  }

  
  private inicioSesionApi(sendFormData: any){

    let overlayRef = this.loadingService.open();

    this.coreService.login(sendFormData).subscribe({
      next: (response: any) => {
        
        overlayRef.close();

        if(response.error){
          this.loading = false;

          /*this.toastr.error(response.error, '', {
            timeOut: 3000,
            closeButton: true
          });*/
          this.showMessageInfo(response.error);


          return;
        }

        const Expires = new Date();
        Expires.setSeconds(Expires.getSeconds() + response.expire);

        const tokenAndExpire = {
          token: response.token,
          expire: Expires
        }

        this.localService.storageSetJsonValue('DATA_TOK', tokenAndExpire);

        //localStorage.setItem('DATA_TOK', JSON.stringify(tokenAndExpire));

        console.log('ruc empresa: ' + response.rucEmpresa);
        const dataUserBus = {
          _userId: response.idUsuario,
          _bussId: response.idEmpresa,
          _ruc: '' + response.rucEmpresa
        }

        this.localService.storageSetJsonValue('DATA_USER', dataUserBus);


        let dataStoreGlobalModel = new DataStoreGlobalModel()
        dataStoreGlobalModel.idEmpresa = response.idEmpresa;
        dataStoreGlobalModel.rucEmpresa = response.rucEmpresa;
        dataStoreGlobalModel.idUser = response.idUsuario;

        //this.dataStoreService.setGlobalState(dataStoreGlobalModel);

        if(response.redirecRegistroEmp){
          this.router.navigate(['/infoempresa']);
        }

        if(response.redirectToHome){
          this.router.navigate(['/clientes'])
        }

      },
      error: (error) => {
        this.loading = false;

        overlayRef.close();
        /*this.toastr.error('error al conectar', '', {
          timeOut: 3000,
          closeButton: true
        });*/
        this.showMessageInfo('error al conectar');

      }
    });

  }

  private showMessageInfo(textShow: string): void{
        this.showTextMessageInfo = true
        this.textMessage = textShow;
        setTimeout(() => {
          this.showTextMessageInfo = false
          //this.textMessage = '';
        }, 8000);
        setTimeout(() => {
          this.textMessage = '';
        }, 8300);
  }
}
