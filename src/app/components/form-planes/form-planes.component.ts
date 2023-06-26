import { Component, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-planes',
  templateUrl: './form-planes.component.html',
  styleUrls: ['./form-planes.component.css']
})
export class FormPlanesComponent implements OnInit {

  constructor(
    public matDialogRef: MatDialogRef<FormPlanesComponent>,
    private router: Router
  ) { }

  ngOnInit(): void {

  }


  clickPlanBasic(){
    this.matDialogRef.close();
    this.router.navigate(['/checkout', 'basicplan']);
  }

  clickPlanMedium(){
    this.matDialogRef.close();
    this.router.navigate(['/checkout', 'mediumplan'])
  }

  clickPlanPremium(){
    this.matDialogRef.close();
    this.router.navigate(['/checkout', 'premiumplan'])
  }
}
