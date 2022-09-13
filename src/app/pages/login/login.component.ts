import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationProvider } from '../../providers/provider';
import { LoadingService } from '../../services/Loading.service';

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
    private loadingService: LoadingService
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

          this.showMessageInfo(response.error);

          return;
        }

        const Expires = new Date();
        Expires.setSeconds(Expires.getSeconds() + response.expire);

        const tokenAndExpire = {
          token: response.token,
          expire: Expires
        }

        const dataUserBus = {
          _userId: response.idUsuario,
          _bussId: response.idEmpresa,
          _ruc: '' + response.rucEmpresa
        }

        sessionStorage.setItem('_valtok', JSON.stringify(tokenAndExpire));
        sessionStorage.setItem('_valuser', JSON.stringify(dataUserBus));

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
