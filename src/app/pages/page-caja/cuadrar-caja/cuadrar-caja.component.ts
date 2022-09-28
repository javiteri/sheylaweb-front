import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MonedaCantidadItem } from '../models/MonedaCantidadModel';

import {ListMonedaCantidad} from '../models/ListMonedaCantidadValues';

@Component({
  selector: 'app-cuadrar-caja',
  templateUrl: './cuadrar-caja.component.html',
  styleUrls: ['./cuadrar-caja.component.css']
})
export class CuadrarCajaComponent implements OnInit {

  displayedColumns: string[] = ['moneda','cantidad'];
  datasource = new MatTableDataSource<MonedaCantidadItem>();
  
  constructor() { 
    console.log(ListMonedaCantidad);

    this.datasource.data = ListMonedaCantidad;
  }

  ngOnInit(): void {
  }

}
