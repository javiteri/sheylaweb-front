import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/Usuario';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'telefono', 'email', 'username'];
  datasource = new MatTableDataSource<Usuario>();

  constructor(private formBuilder: FormBuilder,
              private router: Router) { 
  }

  ngOnInit(): void {
  }


  nuevoUsuario(){
    this.router.navigate(['/usuarios/nuevo']);
  }
}
