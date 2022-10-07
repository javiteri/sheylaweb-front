import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';

@Component({
  selector: 'app-crear-nueva-empresa-dialog',
  templateUrl: './crear-nueva-empresa-dialog.component.html',
  styleUrls: ['./crear-nueva-empresa-dialog.component.css']
})
export class CrearNuevaEmpresaDialogComponent implements OnInit {

  sendDatosFormNuevaEmpresa : FormGroup;

  constructor(private formBuilder: FormBuilder,
    private coreService: ApplicationProvider,
    private loadingService: LoadingService,
    private toastr: ToastrService,
    public matDialogRef: MatDialogRef<CrearNuevaEmpresaDialogComponent>) { 

    this.sendDatosFormNuevaEmpresa = this.formBuilder.group({
      rucEmpresa: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]]
    });

  }

  ngOnInit(): void {
  }


  crearEmpresaClick(sendDatosForm: any){

    if(this.sendDatosFormNuevaEmpresa.invalid){
      return;
    }

    let overlayRef = this.loadingService.open();

    const valorRuc = sendDatosForm['rucEmpresa'];
    
    this.coreService.crearNuevaEmpresaByRuc(valorRuc).subscribe({
      next: (res: any) => {
        overlayRef.close();

        if(res.existEmp){
          this.toastr.error('La empresa ya se encuentra registrada', '', {
            timeOut: 4000,
            closeButton: true
          });
          return;
        }

        if(res.isCreateEmp){
          this.toastr.success('La empresa ha sido creada correctamente', '', {
            timeOut: 6000,
            closeButton: true
          });

          this.matDialogRef.close(res);
          return;
        }

      },
      error: (error) => {
        overlayRef.close();
        this.toastr.error('Ocurrio un error al insertar la empresa, reintente', '', {
          timeOut: 4000,
          closeButton: true
        });
      }
    })

  }
}
