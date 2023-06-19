import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ToastrService } from 'ngx-toastr';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';

@Component({
  selector: 'app-recuperar-cuenta-dialog',
  templateUrl: './recuperar-cuenta-dialog.component.html',
  styleUrls: ['./recuperar-cuenta-dialog.component.css']
})
export class RecuperarCuentaDialogComponent implements OnInit {

  sendDatosFormRecuperarCuenta : FormGroup;

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
    public matDialogRef: MatDialogRef<RecuperarCuentaDialogComponent>,
    private ref: ChangeDetectorRef) { 

    this.sendDatosFormRecuperarCuenta = this.formBuilder.group({
      rucEmpresa: ['', [Validators.required]],
      email: ['', [Validators.email]]
    });

  }

  ngAfterViewInit(): void {
    this.identificacionInput.nativeElement.focus();
    this.ref.detectChanges();
  }
  
  ngOnInit(): void {
  }


  recoveryAccuntClick(sendDatosForm: any){

    const valorRuc = sendDatosForm['rucEmpresa'];
    const valorEmail = sendDatosForm['email'];
    const regexOnlyNumber = new RegExp(/^\d{13}$/);
  
    if(!regexOnlyNumber.test(valorRuc)){
      this.toastr.error('Ingrese Ruc valido', '', {
        timeOut: 4000,
        closeButton: true
      });
      return;
    }

    if(this.sendDatosFormRecuperarCuenta.invalid){
      return;
    }
    
    let overlayRef = this.loadingService.open();

    this.coreService.recuperarCuenta(valorRuc, valorEmail).subscribe({
      next: (res: any) => {
        overlayRef.close();

        if(!res.existEmpresa && res.existEmpresa == false){
          this.toastr.error(`No existe empresa con esos datos`,'',{
            timeOut: 4000,
            closeButton: true
          });
          return;
        }

        if(res.existEmpresa && valorEmail == ''){
          this.toastr.success('La empresa existe, recuerde que las credenciales iniciales son:</br> Usuario: Admin </br>Contrasena: Admin','',{
            timeOut: 8000,
            closeButton: true,
            enableHtml: true
          });  
          return;
        }

        this.toastr.success(`Se envio un correo de recuperacion a: ${valorEmail}`,'',{
          timeOut: 10000,
          closeButton: true
        });
        this.matDialogRef.close();
      },
      error: (error) => {
        overlayRef.close();
        console.log(error);
        this.toastr.error('Ocurrio un error, reintente', '', {
          timeOut: 4000,
          closeButton: true
        });
      }
    })

  }

}
