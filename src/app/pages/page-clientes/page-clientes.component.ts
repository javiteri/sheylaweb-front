import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog'
import { ClientesComponentComponent } from 'src/app/components/clientes-component/clientes-component.component';

export interface Cliente{
  ci: String,
  nombre: String,
  tipo: String,
  email: String,
  telefono: String,
  nacionalidad: String
}

const clientesData : Cliente[] = [
  {ci: '1316530177', nombre: 'Lider Ignacio Andrade Cevallos', tipo: 'Recurrente', email:'lial2010@hotmail.es', telefono: '0969841775', nacionalidad: 'Ecuador'},
  {ci: '3434235674', nombre: 'Juan Fernandez', tipo: 'Normal', email:'ljuanfer43@hotmail.com', telefono: '0969841775', nacionalidad: 'Ecuaor'},
  {ci: '3434235674', nombre: 'Juan Fernandez', tipo: 'Normal', email:'ljuanfer43@hotmail.com', telefono: '0969841775', nacionalidad: 'Ecuaor'},
  {ci: '3434235674', nombre: 'Juan Fernandez', tipo: 'Normal', email:'ljuanfer43@hotmail.com', telefono: '0969841775', nacionalidad: 'Ecuaor'},
  {ci: '3434235674', nombre: 'Juan Fernandez', tipo: 'Normal', email:'ljuanfer43@hotmail.com', telefono: '0969841775', nacionalidad: 'Ecuaor'},
  {ci: '3434235674', nombre: 'Juan Fernandez', tipo: 'Normal', email:'ljuanfer43@hotmail.com', telefono: '0969841775', nacionalidad: 'Ecuaor'},
  {ci: '3434235674', nombre: 'Juan Fernandez', tipo: 'Normal', email:'ljuanfer43@hotmail.com', telefono: '0969841775', nacionalidad: 'Ecuaor'},
  {ci: '3434235674', nombre: 'Juan Fernandez', tipo: 'Normal', email:'ljuanfer43@hotmail.com', telefono: '0969841775', nacionalidad: 'Ecuaor'},
  {ci: '3434235674', nombre: 'Juan Fernandez', tipo: 'Normal', email:'ljuanfer43@hotmail.com', telefono: '0969841775', nacionalidad: 'Ecuaor'},
  {ci: '3434235674', nombre: 'Juan Fernandez', tipo: 'Normal', email:'ljuanfer43@hotmail.com', telefono: '0969841775', nacionalidad: 'Ecuaor'},
  {ci: '3434235674', nombre: 'Juan Fernandez', tipo: 'Normal', email:'ljuanfer43@hotmail.com', telefono: '0969841775', nacionalidad: 'Ecuaor'}
];

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-page-clientes',
  templateUrl: './page-clientes.component.html',
  styleUrls: ['./page-clientes.component.css']
})
export class PageClientesComponent implements OnInit {

  displayedColumns: string[] = ['ci', 'nombre', 'email', 'tipo', 'telefono', 'nacionalidad', 'actions'];
  datasource = clientesData;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }


  openDialog(){

    const dialogRef = this.dialog.open(ClientesComponentComponent, {
      width: '50%',
      data: {name: 'Lider', animal: 'Lobo'},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialogo cerrado')
      console.log('result ' + result)
    });


  }

}
