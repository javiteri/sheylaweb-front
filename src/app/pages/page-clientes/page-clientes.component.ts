import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
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
  datasource = new MatTableDataSource<Cliente>();

  showPagination = false;
  showSinDatos = false;
  isLoading = true;
  listaClientes: Cliente[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('containerTable', {read: ElementRef}) tableInput!: ElementRef

  constructor(private coreService: ApplicationProvider ,
              private ref: ChangeDetectorRef) { }

  ngOnInit(): void {

      this.isLoading = !this.isLoading;
      /*this.coreService.listaClientes('').subscribe(
      {

        next: (response:  any) => {

          this.isLoading = !this.isLoading;

          if(response['isSucces']){

            this.listaClientes = response['data'];

            if(this.listaClientes.length > 0){
              this.showPagination = !this.showPagination;
            }else{
              this.showSinDatos = !this.showSinDatos;
            }

            this.datasource.data = this.listaClientes;
            this.ref.detectChanges();
            this.datasource.paginator = this.paginator;

          }else{
            console.log(' IS SUCCESS IS FALSE')
          }

        },
        error: (error) => {
          this.isLoading = !this.isLoading;
          this.showSinDatos = !this.showSinDatos;
          console.log('ocurrio un error al ejecutar la peticion' + error);
        }

      });*/
  }


  openDialog(){

    console.log('click nuevo cliente button');
    /*const dialogRef = this.dialog.open(ClientesComponentComponent, {
      width: '50%',
      data: {name: 'Lider', animal: 'Lobo'},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialogo cerrado')
      console.log('result ' + result)
    });*/


  }


  scrollUp(): void{
    //setTimeout( () => this.tableInput.nativeElement.scrollIntoView({behavior: 'smooth', clock: 'end'}));
  }
}
