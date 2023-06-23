import { Component } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-dialog-terminos-condiciones',
  templateUrl: './dialog-terminos-condiciones.component.html',
  styleUrls: ['./dialog-terminos-condiciones.component.css']
})
export class DialogTerminosCondicionesComponent {

  constructor(
    public matDialogRef: MatDialogRef<DialogTerminosCondicionesComponent>
  ){

  }

  clickPolitica(){
    this.matDialogRef.close({clickPolitica: true});
  }
}
