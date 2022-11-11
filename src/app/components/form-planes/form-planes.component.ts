import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-form-planes',
  templateUrl: './form-planes.component.html',
  styleUrls: ['./form-planes.component.css']
})
export class FormPlanesComponent implements OnInit {

  constructor(
    public matDialogRef: MatDialogRef<FormPlanesComponent>
  ) { }

  ngOnInit(): void {
  }

}
