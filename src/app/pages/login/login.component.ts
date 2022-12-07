import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationProvider } from '../../providers/provider';
import { LoadingService } from '../../services/Loading.service';
import { MatDialog } from '@angular/material/dialog';
import { CrearNuevaEmpresaDialogComponent } from 'src/app/components/crear-nueva-empresa-dialog/crear-nueva-empresa-dialog.component';
import { RecuperarCuentaDialogComponent } from 'src/app/components/recuperar-cuenta-dialog/recuperar-cuenta-dialog.component';

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

  showDivCredentials = false;
  rucDivCredential = '';

  isDefaultAdminUser = false;
  hide = true;
  
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    private coreService: ApplicationProvider,
    private loadingService: LoadingService,
    private matDialog: MatDialog
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

        if(response.sinLicencia == true){
          this.showMessageInfo('El acceso se encuentra suspendido por falta de pago.');
          this.loading = false;

          return;
        }

        if(response.existEmp == false){
          this.loading = false;

          this.showMessageInfo('No existe Empresa');

          return;
        }
        if(response.error){
          this.loading = false;

          this.showMessageInfo(response.error);

          return;
        }

        if(!response.existUser){
          this.loading = false;

          this.showMessageInfo('No Existe Usuario');
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
          _ruc: '' + response.rucEmpresa,
          _nameUsr: response.nombreUsuario,
          _nameEmp: response.nombreEmpresa,
          _nombreBd: response.nombreBd
        }

        sessionStorage.setItem('_valtok', JSON.stringify(tokenAndExpire));
        sessionStorage.setItem('_valuser', JSON.stringify(dataUserBus));

        if(this.isDefaultAdminUser){
          this.router.navigate(['/usuarios/editar',response.idUsuario]);
          return;
        }
        if(response.nombreEmpresa == 'EMPRESA NUEVA'){
          this.router.navigate(['/infoempresa']);
          return;
        }

        if(response.redirectToHome){
          this.router.navigate(['/dashboard']);
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


  nuevaEmpresaClick(){
    const dialogRef = this.matDialog.open(CrearNuevaEmpresaDialogComponent, {
      minWidth: '0',
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.isCreateEmp){
          this.showDivCredentials = true;
          this.rucDivCredential = result.rucEmpresa;
        }
      }
    });

  }

  recoveryAccountClick(){
    const dialogRef = this.matDialog.open(RecuperarCuentaDialogComponent, {
      minWidth: '0',
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.isCreateEmp){
          this.showDivCredentials = true;
          this.rucDivCredential = result.rucEmpresa;
        }
      }
    });
  }


  // VERIFY IF EXIST RUC WITH USER AND PASSWORD
  verifyExistAdminByRuc(ruc: string){
    const regexOnlyNumber = new RegExp(/^\d{13}$/);
    if(regexOnlyNumber.test(ruc)){
      let overlayRef = this.loadingService.open();
      this.coreService.validateDefaultUser(ruc).subscribe({
        next: (res: any) => {
          overlayRef.close();      

          if(!res.isSuccess || res.existDefaultUser == false){
            this.isDefaultAdminUser = false;
            return;
          }

          this.showDivCredentials = true;
          this.rucDivCredential = ruc;
          this.isDefaultAdminUser = true;
        },
        error:(error: any) => {
          overlayRef.close();
          this.isDefaultAdminUser = false;
        }
      });

    }
  }


}
