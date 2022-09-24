import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import { Config } from './models/Config';

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.css']
})
export class ConfiguracionesComponent implements OnInit {

  listDecimalesVenta = ["0.00","0.000","0.0000","0.00000","0.000000"]

  decimalesVentaSelect = "0.00";
  decimalesCompraSelect = "0.00";
  ivaSelect = "12.00"

  idEmpresa: number = 0;
  rucEmpresa: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;
  
  constructor(private location: Location,
    private coreService: ApplicationProvider) { }

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
  }


  changeValorIva(): void{
    const regexOnlyNumber = new RegExp(/^\d+(\.\d{1,2})?$/);
    
    if(!regexOnlyNumber.test(this.ivaSelect)){
      this.ivaSelect = "12.00";
      return;
    }
  }


  cancelarClick(): void{
    this.location.back();    
  }

  saveDatosConfig(): void{

    const arrayConfig : Config[] = [];

    arrayConfig.push({idEmpresa: this.idEmpresa, nombreConfig: 'FACTURA_VALORIVA', valorConfig: this.ivaSelect});
    arrayConfig.push({idEmpresa: this.idEmpresa, nombreConfig: 'VENTA_NUMERODECIMALES', valorConfig: this.decimalesVentaSelect});
    arrayConfig.push({idEmpresa: this.idEmpresa, nombreConfig: 'COMPRA_NUMERODECIMALES', valorConfig: this.decimalesCompraSelect});

    this.coreService.insertListConfigsToBD(arrayConfig, this.tokenValidate).subscribe({
      next: (data: any) => {
        console.log('inside todo ok');
        console.log(data);
      },
      error: (error) => {
        console.log('inside error');
        console.log(error);
      }
    });

  }
}
