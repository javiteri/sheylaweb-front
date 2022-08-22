import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { Usuario } from 'src/app/interfaces/Usuario';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'telefono', 'email', 'username'];
  datasource = new MatTableDataSource<Usuario>();

  showPagination = false;
  showSinDatos = false;
  isLoading = false;
  listaUsuarios: Usuario[] = [];

  idEmpresa: number = 0;
  rucEmpresa: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('containerTable', {read: ElementRef}) tableInput!: ElementRef

  constructor(private formBuilder: FormBuilder,
              private localService: LocalService,
              private router: Router) { 
  }

  ngOnInit(): void {

    // GET INITIAL DATA 
    const localServiceResponseToken = this.localService.storageGetJsonValue('DATA_TOK');
    const localServiceResponseUsr = this.localService.storageGetJsonValue('DATA_USER');

    this.dataUser = localServiceResponseToken;
    const { token, expire } = this.dataUser;
    this.tokenValidate = { token, expire};

    this.idEmpresa = localServiceResponseUsr._bussId;
    this.rucEmpresa = localServiceResponseUsr._ruc;


  }


  nuevoUsuario(){
    this.router.navigate(['/usuarios/nuevo']);
  }

  private getListUsuariosRefresh(): void {
    this.isLoading = !this.isLoading
  }
}
