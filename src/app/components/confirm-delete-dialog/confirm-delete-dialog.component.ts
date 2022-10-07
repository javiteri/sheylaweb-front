import { Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  title: string;
  header: string,
  textBtnPositive?: string,
  textBtnCancelar?: string,
}


@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.css']
})
export class ConfirmDeleteDialogComponent implements OnInit{

  headertitle: string = 'HEADER';
  titleDialog: string = 'Titulo';

  btnTextPositive: string = 'Eliminar';
  btnTextCancelar: string = 'Cancelar';

  constructor(public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData) { }


    onNoClick(): void{
      this.dialogRef.close();
    }

    ngOnInit(): void {
      this.titleDialog = this.dialogData['title'];
      this.headertitle = this.dialogData['header'];

      if(this.dialogData['textBtnPositive']){
        this.btnTextPositive = this.dialogData['textBtnPositive'];
      }

      if(this.dialogData['textBtnCancelar']){
        this.btnTextCancelar = this.dialogData['textBtnCancelar'];
      }
    }
}
