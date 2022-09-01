import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';

import nacionalidad from '../../assets/nacionalidad.json';

@Component({
  selector: 'app-crear-cliente-dialog',
  templateUrl: './crear-cliente-dialog.component.html',
  styleUrls: ['./crear-cliente-dialog.component.css']
})
export class CrearClienteDialogComponent implements OnInit {


  
  
  constructor(private coreService: ApplicationProvider) { 

  }

  ngOnInit(): void {
    console.log('inside dialog component');
  }

  
}
