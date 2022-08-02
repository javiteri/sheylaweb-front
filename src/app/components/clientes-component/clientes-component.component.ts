import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'

@Component({
  selector: 'app-clientes-component',
  templateUrl: './clientes-component.component.html',
  styleUrls: ['./clientes-component.component.css']
})
export class ClientesComponentComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<ClientesComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: String) { }

  ngOnInit(): void {
  }

  onNoClick(){
    this.dialogRef.close()
  }

}
