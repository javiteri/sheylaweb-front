import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.css']
})
export class NuevoUsuarioComponent implements OnInit {

  sendDatosFormUsuario : FormGroup;

  constructor(private formBuilder: FormBuilder) { 

    this.sendDatosFormUsuario = this.formBuilder.group({
      nombreNatural: ['', Validators.required],
      telefono: [''],
      direccion: [''],
      email: [''],
      fechaNacimiento: [''],
      nombreUsuario: [''],
      password: ['']
    });
  }

  ngOnInit(): void {
  }

}
