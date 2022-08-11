import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationProvider } from '../providers/provider';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  sendLoginForm: FormGroup
  loading = false;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    private coreService: ApplicationProvider
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
        return;
    }


    this.coreService.login(sendFormData).subscribe({
      next: (response: any) => {
        
        if(response.error){
          console.log('api: ' + response.error);
          this.loading = false;
          return;
        }

        const Expires = new Date(); 
        Expires.setSeconds(Expires.getSeconds() + response.expire);

        const tokenAndExpire = {
          token: response.token,
          expire: Expires
        }

        localStorage.setItem('DATA_USER', JSON.stringify(tokenAndExpire));

        if(response.redirecRegistroEmp){

          const idEmpresa = response.idEmpresa;
          const rucEmpresa = response.rucEmpresa;
          
          this.router.navigate(['/registroempresa', idEmpresa, rucEmpresa]);
        }

        if(response.redirectToHome){
          this.router.navigate(['/clientes'])
        }


      },
      error: (error) => {
        console.log(error);
        this.loading = false;
      }
    });

  }
}
