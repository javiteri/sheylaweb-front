import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MonedaCantidadItem } from '../models/MonedaCantidadModel';
import {ListMonedaCantidad} from '../models/ListMonedaCantidadValues';
import { ItemCuadreCajaWithDetalle } from '../models/ItemCuadreCajaMov';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ApplicationProvider } from 'src/app/providers/provider';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { LoadingService } from 'src/app/services/Loading.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteDialogComponent } from 'src/app/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { ConfigReceive } from '../../configuraciones/models/ConfigReceive';

@Component({
  selector: 'app-cuadrar-caja',
  templateUrl: './cuadrar-caja.component.html',
  styleUrls: ['./cuadrar-caja.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CuadrarCajaComponent implements OnInit {

  displayedColumns: string[] = ['moneda','cantidad'];
  datasource = new MatTableDataSource<MonedaCantidadItem>();

  dataSourceListMov: ItemCuadreCajaWithDetalle[] = [];
  columnsToDisplay = ['tipo','grupo','monto','fecha'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: ItemCuadreCajaWithDetalle | null = null;

  idEmpresa: number = 0;
  idUser: number = 0;
  rucEmpresa: string = '';
  nombreBd: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;
  
  dateInicioFilter = new Date();
  dateFinFilter = new Date();

  usuarioSelect: any = {usu_username: 'TODOS',usu_id:0};
  listUsuarios: any = [];

  totalIngresosMenosEgresoListMov = "00.0";
  totalCajaListMov = "00.0";

  totalValorCaja = "00.00";
  totalArqueoCaja = "00.00";
  totalResultadoValorArqueo = "00.00";

  showSinMovimientos = true;

  isAllowChangeDate = false;
  isAllowChangeuser = false;

  constructor(private coreService: ApplicationProvider,
    private loadingService: LoadingService,
    private toastr: ToastrService,
    private matDialog: MatDialog) { 
    
  }

  ngOnInit(): void {

    this.cloningArrayMonedasCant();

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
    this.idUser = localServiceResponseUsr._userId;
    this.nombreBd = localServiceResponseUsr._nombreBd;

    this.listUsuarios.push(this.usuarioSelect);

    this.getListMovimientosCuadrarCajaByIdEmp();
    this.getUsuariosByIdEmpresa();
    this.getValorCajaByIdEmp();
    this.getConfigAllowChangeFecha();
    this.getConfigAllowChangeUsarioCaja();
  }

  private cloningArrayMonedasCant(){
    let cloningArray: MonedaCantidadItem[] = [];
    ListMonedaCantidad.forEach(value => cloningArray.push(Object.assign({}, value)));

    this.datasource.data = cloningArray;
  }

  private getListMovimientosCuadrarCajaByIdEmp(){

    const dialogRef = this.loadingService.open();

    const dateInitString = '' + this.dateInicioFilter.getFullYear() + '-' + ('0' + (this.dateInicioFilter.getMonth()+1)).slice(-2) + 
                          '-' + ('0' + this.dateInicioFilter.getDate()).slice(-2) + ' ' + 
                            '00:00:00' ;
    const dateFinString = '' + this.dateFinFilter.getFullYear() + '-' + ('0' + (this.dateFinFilter.getMonth()+1)).slice(-2) + 
                            '-' + ('0' + this.dateFinFilter.getDate()).slice(-2) + ' ' + 
                              '23:59:59' ;

    this.coreService.getListMovimientosCuadrarCajaByIdEmp(this.idEmpresa, this.usuarioSelect.usu_id,
                  dateInitString,dateFinString, this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {
        dialogRef.close();

        this.dataSourceListMov = data.data;

        let valorTotalCajaSum = 0.0;
        let valorIngresosMenosEgreso = 0.0;

        this.dataSourceListMov.forEach((valor: ItemCuadreCajaWithDetalle) => {

          valor.monto = Number(valor.monto).toFixed(2);
          
          if(valor.tipo == 'INGRESO'){
            valorIngresosMenosEgreso += Number(valor.monto);
            valorTotalCajaSum += Number(valor.monto)
          }else{
            valorIngresosMenosEgreso -= Number(valor.monto);
            valorTotalCajaSum -= Number(valor.monto)
          }

        });
        
        this.totalCajaListMov = valorTotalCajaSum.toFixed(3);
        this.totalIngresosMenosEgresoListMov = valorIngresosMenosEgreso.toFixed(3);

        this.showSinMovimientos = this.dataSourceListMov.length > 0

      }, 
      error: (error: any) => {
        dialogRef.close();
        console.log('error obteniendo lista movimientos grupo');
      }
    });
  }

  private getValorCajaByIdEmp(): void{
    this.coreService.getValorCajaByIdEmp(this.idEmpresa,this.tokenValidate, this.nombreBd).subscribe({
      next: (valor: any) => {

        this.totalValorCaja = Number(valor.data.valorcaja).toFixed(3);

        this.totalResultadoValorArqueo = (Number(this.totalResultadoValorArqueo) - Number(valor.data.valorcaja)).toFixed(3);
      },
      error: (exception: any) => {
        console.log('error obteniendo valor caja');
      }
    });
  }

  searchListCuadreCaja(){
    this.getListMovimientosCuadrarCajaByIdEmp();
  }

  private getUsuariosByIdEmpresa(){
    this.coreService.getUsuariosByIdEmp(this.idEmpresa, this.tokenValidate, this.nombreBd).subscribe({
      next: (dataUsers: any) => {

        const valueTodos = {
          usu_username: "TODOS",
          usu_id: 0
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

  calcularTotalSumaArqueo(cantidad: any, index:any){

    const regexOnlyNumber = new RegExp(/^\d+(\.\d{1,10})?$/);
    if(!regexOnlyNumber.test(cantidad)){
      this.datasource.data[index].cantidad = '';
    }
    this.datasource.data[index].cantidad = Number(cantidad).toFixed(2);

    let totalArqueo = 0.0;
    this.datasource.data.forEach((value: MonedaCantidadItem) => {
      if(value.cantidad){
        if(value.valor){
          totalArqueo += (Number(value.cantidad) * Number(value.valor))
        }else{
          totalArqueo += (Number(value.cantidad));
        }
      }
    });

    this.totalArqueoCaja = totalArqueo.toFixed(3);
    this.totalResultadoValorArqueo = (totalArqueo - Number(this.totalValorCaja)).toFixed(3);

  }

  guardarValoresCuadreCaja(): void{


      const totalArqueoNumber = Number(this.totalArqueoCaja);
      const valorCajaEmp = Number(this.totalValorCaja);

      if(totalArqueoNumber > 0 && valorCajaEmp > 0){
        
        const dialogRef = this.matDialog.open(ConfirmDeleteDialogComponent, {
          width: '250px',
          data: {
            title: 'Esta seguro que desea guardar los valores de Cuadre de Caja?',
            header:'Cuadrar Caja',
            textBtnPositive: 'Aceptar',
            textBtnCancelar: 'Cancelar',
            isNormalColors: false
          }
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if(result){
            
            const actualDateHours = new Date();
            const dateString = '' + actualDateHours.getFullYear() + '-' + ('0' + (actualDateHours.getMonth()+1)).slice(-2) + 
                          '-' + ('0' + actualDateHours.getDate()).slice(-2) + ' ' + 
                          actualDateHours.getHours() + ':' + actualDateHours.getMinutes() + ':' + actualDateHours.getSeconds();

            let valorConceptoPlus = 'Caja Cuadrada';
            if(Number(this.totalResultadoValorArqueo) > 0){
              valorConceptoPlus += ` Con Excedente de $ ${this.totalResultadoValorArqueo}`;
            }
            if(Number(this.totalResultadoValorArqueo) < 0){
              valorConceptoPlus += ` Con Faltante de $ ${this.totalResultadoValorArqueo}`;
            }

            const valueSendBitacora = {
              idEmp: this.idEmpresa,
              fecha: dateString,
              tipo: 'CUADRE CAJA',
              concepto: valorConceptoPlus,
              idUser: this.idUser,
              grupo: 'CAJA CUADRADADA',
              monto: this.totalResultadoValorArqueo,
              nombreBd: this.nombreBd
            }

            const dialogRef = this.loadingService.open();
            this.coreService.insertCuadreCajaByIdEmp(valueSendBitacora,this.tokenValidate).subscribe({
              next: (data: any) => {
                dialogRef.close();
                this.resetControls();
                
                this.toastr.success('Cuadre de Caja Realizado Correctamente', '', {
                  timeOut: 3000,
                  closeButton: true
                });

              },
              error: (exception) => {
                dialogRef.close();
                
                this.toastr.success('Ocurrio un error reintente', '', {
                  timeOut: 3000,
                  closeButton: true
                });
              }
            });

    
          }
        });

      }else{
        console.log('no se puede guardar los datos');
      }
  }

  private resetControls(){
    this.cloningArrayMonedasCant();
    this.getValorCajaByIdEmp();
    this.getListMovimientosCuadrarCajaByIdEmp();
    
    this.totalArqueoCaja = "00.00";
    this.totalResultadoValorArqueo = "00.00";
  }

  private getConfigAllowChangeFecha(){
    this.coreService.getConfigByNameIdEmp(this.idEmpresa,'CAJA_PERMITIR_CAMBIAR_FECHA', this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {
        if(data.data.length > 0){
          const configReceive: ConfigReceive = data.data[0];

          this.isAllowChangeDate = (configReceive.con_valor == "1") ? true : false;
        }

      },
      error: (error) => {
        console.log('error get num decimales');
        console.log(error);
      }
    });
  }

  private getConfigAllowChangeUsarioCaja(){
    this.coreService.getConfigByNameIdEmp(this.idEmpresa,'CAJA_PERMITIR_CAMBIAR_USUARIO', this.tokenValidate, this.nombreBd).subscribe({
      next: (data: any) => {

        if(data.data.length > 0){
          const configReceive: ConfigReceive = data.data[0];

          this.isAllowChangeuser = (configReceive.con_valor == "1") ? true : false;
        }

        

      },
      error: (error) => {
        console.log('error get num decimales');
        console.log(error);
      }
    });
  }

}
