import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Establecimiento } from '../models/Establecimiento';

@Component({
  selector: 'app-puntos-emision',
  templateUrl: './puntos-emision.component.html',
  styleUrls: ['./puntos-emision.component.css']
})
export class PuntosEmisionComponent implements OnInit {

  displayedColumns: string[] = ['establecimiento', 'nombreEmpresa', 'direccion', 'logo', 'actions'];
  datasource = new MatTableDataSource<Establecimiento>();
  
  showSinDatos = true;

  constructor() { }

  ngOnInit(): void {
  }

}
