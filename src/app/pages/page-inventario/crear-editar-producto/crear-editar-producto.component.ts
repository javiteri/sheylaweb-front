import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-crear-editar-producto',
  templateUrl: './crear-editar-producto.component.html',
  styleUrls: ['./crear-editar-producto.component.css']
})
export class CrearEditarProductoComponent implements OnInit {

  sendDatosFormProducto : FormGroup;
  
  idProductoEdit: number = 0;
  idEmpresa: number = 0;
  rucEmpresa: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  loading = false;
  editMode = false;

  titlePage = 'Nuevo Producto'
  
  constructor(private formBuilder: FormBuilder,
    private coreService: ApplicationProvider,
    private loadingService: LoadingService,
    private toastr: ToastrService,
    private localService: LocalService,
    private route: ActivatedRoute,
    private router: Router) { 

      this.sendDatosFormProducto = formBuilder.group({
        codigo: ['', Validators.required],
        codigoBarras: [''],
        nombre: ['', Validators.required],
        pvp: [''],
        costo: [''],
        utilidad: [''],
        stock: [''],
        unidadMedida: [''],
        categoria: [''],
        marca: [''],
        iva: [false],
        activo: [false],
        observacion: ['']
      });
    }

  ngOnInit(): void {
  }


  saveDatosProducto(sendFormProducto: any){
    if(this.sendDatosFormProducto.invalid){
      this.loading = false;

      this.toastr.error('verifique que los datos esten llenos', '', {
          timeOut: 3000,
          closeButton: true
        });

      return;
    }

    sendFormProducto['idEmpresa'] = this.idEmpresa;

    if(this.editMode){
      sendFormProducto['idProducto'] = this.idProductoEdit;
      this.updateDatosProductoApi(sendFormProducto);
    }else{
      this.insertDatosProductoApi(sendFormProducto);
    }
  }

  private insertDatosProductoApi(sendFormProveedor: any){
    let overlayRef = this.loadingService.open();

    this.coreService.insertProveedorToBD(sendFormProveedor, this.tokenValidate).subscribe({
      next: (data: any) => {

        overlayRef.close();
        if(data.code == 400){
          return;
        }

        this.toastr.success('Proveedor Guardado', '', {
          timeOut: 3000,
          closeButton: true
        });

        setTimeout(() => {
          this.router.navigate(['/proveedores']);
        }, 600);

        //this.resetControlsForm();
      },
      error: (error) => {
        overlayRef.close();

        if(error.error.duplicate){

          this.toastr.error(error.error.messageError, '', {
            timeOut: 3000,
            closeButton: true
          });
          return;
        }

        this.toastr.error('error al guardar', '', {
          timeOut: 3000,
          closeButton: true
        });
      }
    });
  }
  private updateDatosProductoApi(sendFormProducto: any){
    let overlayRef = this.loadingService.open();

    this.coreService.updateProveedorToBD(sendFormProducto, this.tokenValidate).subscribe({
      next: (data: any) => {

        overlayRef.close();
        if(data.code == 400){
          return;
        }

        this.toastr.success('Proveedor Actualizado', '', {
          timeOut: 3000,
          closeButton: true
        });

        setTimeout(() => {
          this.router.navigate(['/proveedores']);
        }, 600);

      },
      error: (error) => {
        overlayRef.close();

        this.toastr.error(error.error.message, '', {
          timeOut: 3000,
          closeButton: true
        });
      }
    });
  }
}
