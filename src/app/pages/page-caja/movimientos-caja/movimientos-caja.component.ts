import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';
import { ItemResumenMovimiento } from '../models/ItemResumenMovimiento';

@Component({
  selector: 'app-movimientos-caja',
  templateUrl: './movimientos-caja.component.html',
  styleUrls: ['./movimientos-caja.component.css']
})
export class MovimientosCajaComponent implements OnInit {

  displayedColumns: string[] = ['fecha hora', 'tipo', 'monto', 'concepto', 'responsable'];
  datasource = new MatTableDataSource<ItemResumenMovimiento>();

  idEmpresa: number = 0;
  rucEmpresa: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  showPagination = false;
  showSinDatos = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dateInicioFilter = new Date();
  dateFinFilter = new Date();

  tipoMovimientoSelect = 'TODOS';
  listTipoMovimiento = ['TODOS', 'INGRESO', 'EGRESO','NUEVO SALDO'];

  usuarioSelect: any = {usu_username: 'TODOS'};
  listUsuarios: any = [];
  conceptoMovimientoSearch = '';

  constructor(
    private coreService: ApplicationProvider,
    private ref: ChangeDetectorRef,
    private loadingService: LoadingService
  ) { }

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

    this.getListMovimientosCaja();
    this.getUsuariosByIdEmpresa();
  }

  private getListMovimientosCaja(){

    let dialogRef = this.loadingService.open();
    
    if(!(this.dateInicioFilter && this.dateFinFilter)){
      dialogRef.close();
      return;
    }

    const dateInitString = '' + this.dateInicioFilter.getFullYear() + '-' + ('0' + (this.dateInicioFilter.getMonth()+1)).slice(-2) + 
                          '-' + ('0' + this.dateInicioFilter.getDate()).slice(-2) + ' ' + 
                            '00:00:00' ;
    const dateFinString = '' + this.dateFinFilter.getFullYear() + '-' + ('0' + (this.dateFinFilter.getMonth()+1)).slice(-2) + 
                            '-' + ('0' + this.dateFinFilter.getDate()).slice(-2) + ' ' + 
                              '23:59:59' ;

    const usuarioName = (this.usuarioSelect.usu_username == 'TODOS') ? 0 : this.usuarioSelect.usu_id;
    const tipoMovimiento = (this.tipoMovimientoSelect == 'TODOS') ? '' : this.tipoMovimientoSelect;

    this.coreService.getListMovimientosCajaByIdEmp(this.idEmpresa,usuarioName,tipoMovimiento,this.conceptoMovimientoSearch,
                                                    dateInitString,dateFinString,this.tokenValidate).subscribe({
      next: (data: any) => {

        dialogRef.close();
        console.log(data);
        if(data.data){
          const arrayData = Array.from<ItemResumenMovimiento>(data.data);
          const arrayMap = arrayData.map<ItemResumenMovimiento>((valor: ItemResumenMovimiento) => {
            if(valor.tipo == 'EGRESO'){
              valor.monto = `-${valor.monto}`
            }
            return valor;
          });

          this.datasource.data = arrayMap;
          this.ref.detectChanges();
        }

        if(this.datasource.data.length > 0){
          this.showSinDatos = false
        }else{
          this.showSinDatos = true;
        }

      },
      error: (exception: any) => {
        dialogRef.close();
        console.log('error list');
        console.log(exception);
      }
     });
  }

  searchListMovimientosCaja(): void{
    this.getListMovimientosCaja();
  }

  private getUsuariosByIdEmpresa(){
    this.coreService.getUsuariosByIdEmp(this.idEmpresa, this.tokenValidate).subscribe({
      next: (dataUsers: any) => {

        const valueTodos = {
          usu_username: "TODOS"
        }

        dataUsers.data.unshift(valueTodos);
        this.listUsuarios = dataUsers.data;
        this.usuarioSelect = this.listUsuarios[0];
      },
      error: (error) => {
        console.log('error obteniendo usuarios');
      }
    });
  }
}
