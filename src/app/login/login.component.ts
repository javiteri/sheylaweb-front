import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  sendLoginForm: FormGroup

  constructor(
    public formBuilder: FormBuilder,
    public router: Router
  ) {

    this.sendLoginForm = this.formBuilder.group({
      ruc: ['', Validators.required],
      usuario: ['', Validators.required],
      clave: ['', Validators.required]
    })


  }

  ngOnInit(): void {
  }


  login(sendData: any){

    console.log('ruc: ' + sendData.ruc);
    console.log('usuario: ' + sendData.usuario);
    console.log('clave: ' + sendData.clave);

    if (this.sendLoginForm.invalid) {

        console.log('error en los campos del formulario');
        return;
    }


    this.router.navigate(['/clientes']);

  }
}
