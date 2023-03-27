import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ListCompraItemsService } from 'src/app/pages/page-compras/services/list-compra-items.service';

@Component({
  selector: 'app-sri-buscar-documento-xml',
  templateUrl: './sri-buscar-documento-xml.component.html',
  styleUrls: ['./sri-buscar-documento-xml.component.css']
})
export class SriBuscarDocumentoXmlComponent implements OnInit{

  claveAcceso: string = '';

  constructor(
    public matDialogRef: MatDialogRef<SriBuscarDocumentoXmlComponent>,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {

  }

  continuarClick(){
    
    const regexOnlyNumber = new RegExp(/^\d{49}$/);
    if(!regexOnlyNumber.test(this.claveAcceso)){

      this.toastr.error('Clave Incorrecta', '', {
        timeOut: 3000,
        closeButton: true
      });

      return;
    }

    const response = {
      claveAcceso: this.claveAcceso
    }
    this.matDialogRef.close(response);

  }
}
