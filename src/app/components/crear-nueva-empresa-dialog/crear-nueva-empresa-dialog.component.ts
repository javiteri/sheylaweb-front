import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ToastrService } from 'ngx-toastr';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';

@Component({
  selector: 'app-crear-nueva-empresa-dialog',
  templateUrl: './crear-nueva-empresa-dialog.component.html',
  styleUrls: ['./crear-nueva-empresa-dialog.component.css']
})
export class CrearNuevaEmpresaDialogComponent implements OnInit, AfterViewInit {

  sendDatosFormNuevaEmpresa : FormGroup;

  identificacionInput! : ElementRef<HTMLInputElement>;
  @ViewChild('identificacionInput') set inputElRef(elRef: ElementRef<HTMLInputElement>){
    if(elRef){
      this.identificacionInput = elRef;
    }
  }
  
  constructor(private formBuilder: FormBuilder,
    private coreService: ApplicationProvider,
    private loadingService: LoadingService,
    private toastr: ToastrService,
    public matDialogRef: MatDialogRef<CrearNuevaEmpresaDialogComponent>,
    private ref: ChangeDetectorRef) { 

    this.sendDatosFormNuevaEmpresa = this.formBuilder.group({
      rucEmpresa: ['', [Validators.required]]
    });

  }

  ngAfterViewInit(): void {
    this.identificacionInput.nativeElement.focus();
    this.ref.detectChanges();
  }
  
  ngOnInit(): void {
  }


  crearEmpresaClick(sendDatosForm: any){

    const valorRuc = sendDatosForm['rucEmpresa'];
    const regexOnlyNumber = new RegExp(/^\d{13}$/);

    if(!regexOnlyNumber.test(valorRuc)){
      this.toastr.error('Ingrese Ruc valido', '', {
        timeOut: 4000,
        closeButton: true
      });
      return;
    }

    if(this.sendDatosFormNuevaEmpresa.invalid){
      console.log('insside datos invalid');
      return;
    }
    
    let overlayRef = this.loadingService.open();

    this.coreService.crearNuevaEmpresaByRuc(valorRuc).subscribe({
      next: (res: any) => {
        overlayRef.close();

        if(res.isError){
          this.toastr.error(`Esta empresa no puede ser creada`, '', {
            timeOut: 4000,
            closeButton: true
          });
          return;
        }
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
