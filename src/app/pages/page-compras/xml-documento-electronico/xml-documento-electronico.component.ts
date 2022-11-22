import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProductFactura } from 'src/app/interfaces/ProductFactura';

@Component({
  selector: 'app-xml-documento-electronico',
  templateUrl: './xml-documento-electronico.component.html',
  styleUrls: ['./xml-documento-electronico.component.css']
})
export class XmlDocumentoElectronicoComponent implements OnInit {

  displayedColumns: string[] = ['#', 'Codigo', 'Articulo', 'Cantidad', 'P Unitario','descuento', 'P Total', 'actions'];
  datasource = new MatTableDataSource<ProductFactura>();

  constructor() { }

  ngOnInit(): void {
  }

}
