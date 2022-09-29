import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ignoreElements } from 'rxjs';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ConfigReceive } from 'src/app/pages/configuraciones/models/ConfigReceive';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';

@Component({
  selector: 'app-nuevo-ingreso-caja-dialog',
  templateUrl: './nuevo-ingreso-caja-dialog.component.html',
  styleUrls: ['./nuevo-ingreso-caja-dialog.component.css']
})
export class NuevoIngresoCajaDialogComponent implements OnInit {

  sendDatosFormIngreso : FormGroup;
  isAllowChangeDate = false;

  idEmpresa: number = 0;
  idUsuario: number = 0;
  rucEmpresa: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;
  
  constructor(private formBuilder: FormBuilder,
    private coreService: ApplicationProvider,
    private loadingService: LoadingService,
    public matDialogRef: MatDialogRef<NuevoIngresoCajaDialogComponent>,
    private toastr: ToastrService) { 

      this.sendDatosFormIngreso = this.formBuilder.group({
        fecha: ['', [Validators.required]],
        monto: ['', [Validators.required,Validators.pattern(/^\d+(\.\d{1,10})?$/)]],
        concepto: ['',[Validators.required]]
      });

    }

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
    this.idUsuario = localServiceResponseUsr._userId;

    const actualDate = new Date();
    this.sendDatosFormIngreso.controls['fecha'].setValue(actualDate);

    this.validateChangeDate();
    this.getConfigAllowChangeFecha();
  }

  private validateChangeDate():void{
    if(this.isAllowChangeDate){
      this.sendDatosFormIngreso.controls['fecha'].enable();
    }else{
      this.sendDatosFormIngreso.controls['fecha'].disable();
    }

  }

  private getConfigAllowChangeFecha(){
    this.coreService.getConfigByNameIdEmp(this.idEmpresa,'CAJA_PERMITIR_CAMBIAR_FECHA', this.tokenValidate).subscribe({
      next: (data: any) => {
        console.log('inside config change fecha');
        console.log(data);
        if(data.data.length > 0){
          const configReceive: ConfigReceive = data.data[0];

          this.isAllowChangeDate = (configReceive.con_valor == "1") ? true : false;
        }else{
          this.isAllowChangeDate = false;
        }

        this.validateChangeDate();

      },
      error: (error) => {
        console.log('error get num decimales');
        console.log(error);
      }
    });
  }


  insertIngresoCaja(sendFormValue: any){

    if(this.sendDatosFormIngreso.invalid){
      return;
    }

    sendFormValue['idEmp'] = this.idEmpresa;
    sendFormValue['idUser'] = this.idUsuario;
    sendFormValue['tipo'] = 'INGRESO';
    sendFormValue['grupo'] = 'INGRESO MANUAL DE CAJA';

    if(!sendFormValue['fecha']){

      const selectedDate: Date = new Date();
      const dateString = '' + selectedDate.getFullYear() + '-' + ('0' + (selectedDate.getMonth()+1)).slice(-2) + 
                          '-' + ('0' + selectedDate.getDate()).slice(-2) ;

      sendFormValue['fecha'] = dateString;
    }else{
      const selectedDate: Date = new Date(sendFormValue['fecha']);
      const dateString = '' + selectedDate.getFullYear() + '-' + ('0' + (selectedDate.getMonth()+1)).slice(-2) + 
                          '-' + ('0' + selectedDate.getDate()).slice(-2) ;

      sendFormValue['fecha'] = dateString;
    }

    console.log(sendFormValue);

    const dialogRef = this.loadingService.open();
    this.coreService.insertIngresoEgresoByIdEmp(sendFormValue, this.tokenValidate).subscribe({
      next: (data: any) => {
        console.log(data);
        console.log('inside todo ok ingreso');
        dialogRef.close();
        this.matDialogRef.close(true);
      },
      error: (exception) => {
        dialogRef.close();
        console.log('inside error insert ingreso');
      }
    });

    console.log();

  }
}
