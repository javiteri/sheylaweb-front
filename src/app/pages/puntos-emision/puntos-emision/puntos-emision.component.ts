import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/application/application';
import { LoadingService } from 'src/app/services/Loading.service';
import { Establecimiento } from '../models/Establecimiento';

@Component({
  selector: 'app-puntos-emision',
  templateUrl: './puntos-emision.component.html',
  styleUrls: ['./puntos-emision.component.css']
})
export class PuntosEmisionComponent implements OnInit {

  displayedColumns: string[] = ['establecimiento', 'nombreEmpresa', 'direccion', 'telefono', 'actions'];
  datasource = new MatTableDataSource<Establecimiento>();
  
  showSinDatos = true;

  idEmpresa: number = 0;
  rucEmpresa: string = '';
  nombreBd: string = '';

  empresaData: any;

  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;
  
  constructor(private coreService: ApplicationProvider,
    public router: Router,
    private loadingService: LoadingService) { }

  ngOnInit(): void {

    // GET INITIAL DATA 
    const localServiceResponseToken =  
          JSON.parse(sessionStorage.getItem('_valtok') ? sessionStorage.getItem('_valtok')! : '');
    const localServiceResponseUsr = 
          JSON.parse(sessionStorage.getItem('_valuser') ? sessionStorage.getItem('_valuser')! : '');

    this.dataUser = localServiceResponseToken;
    const { token, expire } = this.dataUser;
    this.tokenValidate = { token, expire};

    this.idEmpresa = localServiceResponseUsr._bussId;
    this.rucEmpresa = localServiceResponseUsr._ruc;
    this.nombreBd = localServiceResponseUsr._nombreBd;

    this.getListEstablecimientos();
  }

  clickNuevoEstabl(){
    this.router.navigate(['establecimientos/nuevo']);
  }


  getListEstablecimientos(){

    let dialog = this.loadingService.open();
    this.coreService.getEstablecimientosByIdEmp(this.idEmpresa, this.nombreBd, this.tokenValidate).subscribe({
      next: (data: any) =>{
        dialog.close();
        console.log('inside data list');
        console.log(data);


        this.datasource.data = data.data;
        //this.ref.detectChanges();
      },
      error: (error: any) =>{
        dialog.close();
        console.log('inside error list');
        console.log(error);
      }
    });
  }
}
