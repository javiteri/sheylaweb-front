import { Component, OnInit } from '@angular/core';

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

@Component({
  selector: 'app-page-clientes',
  templateUrl: './page-clientes.component.html',
  styleUrls: ['./page-clientes.component.css']
})
export class PageClientesComponent implements OnInit {

  displayedColumns: string[] = ['ci', 'nombre', 'email', 'tipo', 'telefono', 'nacionalidad', 'actions'];
  datasource = clientesData;

  constructor() { }

  ngOnInit(): void {
  }

}
