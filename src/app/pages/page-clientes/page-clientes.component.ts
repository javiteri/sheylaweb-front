import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table';
import { ClientesComponentComponent } from 'src/app/components/clientes-component/clientes-component.component';
import { ApplicationProvider } from 'src/app/providers/application/application';
import {Cliente} from '../../interfaces/Cliente'

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

  listaClientes: Cliente[] = [];
  datasource = new MatTableDataSource<Cliente>();

  constructor(private coreService: ApplicationProvider ,
              private dialog: MatDialog) { }

  ngOnInit(): void {

      this.coreService.listaClientes('').subscribe(
      {

        next: (response:  any) => {

          if(response['isSucces']){

            this.listaClientes = response['data'];

            this.datasource.data = this.listaClientes;
          }else{
            console.log(' IS SUCCESS IS FALSE')
          }

        },
        error: (error) => {
          console.log('ocurrio un error al ejecutar la peticion' + error);
        }


      });
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
