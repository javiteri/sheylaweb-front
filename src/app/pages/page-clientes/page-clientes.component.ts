import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-clientes',
  templateUrl: './page-clientes.component.html',
  styleUrls: ['./page-clientes.component.css']
})
export class PageClientesComponent implements OnInit {

  displayedColumns: string[] = ['Ci/Ruc', 'Nombre', 'Tipo', 'Email', 'Telefono', 'Nacionalidad'];

  constructor() { }

  ngOnInit(): void {
  }

}
