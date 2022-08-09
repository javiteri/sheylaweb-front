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
      usuario: ['', Validators.required],
      clave: ['', Validators.required]
    })


  }

  ngOnInit(): void {
  }


  login(sendFormData: any){

    this.loading = true;

    console.log('ruc: ' + sendFormData.ruc);
    console.log('usuario: ' + sendFormData.usuario);
    console.log('clave: ' + sendFormData.clave);

    if (this.sendLoginForm.invalid) {

        console.log('error en los campos del formulario');
        this.loading = false;
        return;
    }


    this.coreService.login(sendFormData).subscribe({
      next: (response: any) => {
        console.log('')
        console.log(response);

        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
      }
    });

    //this.router.navigate(['/clientes']);

  }
}
