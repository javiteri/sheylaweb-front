import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { TokenValidate } from 'src/app/interfaces/IWebData';

@Component({
  selector: 'app-cantidad-producto-dialog',
  templateUrl: './cantidad-producto-dialog.component.html',
  styleUrls: ['./cantidad-producto-dialog.component.css']
})
export class CantidadProductoDialogComponent implements OnInit {

  sendDatosFormCantidadProducto : FormGroup;
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;
  
  constructor(private formBuilder: FormBuilder,
    public matDialogRef: MatDialogRef<CantidadProductoDialogComponent>) { 

      this.sendDatosFormCantidadProducto = this.formBuilder.group({
        cantidad: [1, [Validators.required,Validators.pattern(/^\d+(\.\d{1,3})?$/)]],
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

  }


  setMontoProducto(cantidadProducto: any){

    if(this.sendDatosFormCantidadProducto.invalid || Number(cantidadProducto.cantidad) <= 0){
      return;
    }

    this.matDialogRef.close(cantidadProducto);    
  }

}
