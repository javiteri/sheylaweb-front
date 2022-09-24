import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, startWith, of, observable } from 'rxjs';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';

@Component({
  selector: 'app-crear-editar-producto',
  templateUrl: './crear-editar-producto.component.html',
  styleUrls: ['./crear-editar-producto.component.css']
})
export class CrearEditarProductoComponent implements OnInit, AfterViewInit {

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
  
  listMarcasData = new Array();
  listMarcas = new Observable<any[]>();

  listCategoriasData = new Array();
  listCategorias = new Observable<any[]>();

  codigoInput! : ElementRef<HTMLInputElement>;
  @ViewChild('inputCodigo') set inputElRef(elRef: ElementRef<HTMLInputElement>){
    if(elRef){
      this.codigoInput = elRef;
    }
  }

  constructor(private formBuilder: FormBuilder,
    private coreService: ApplicationProvider,
    private loadingService: LoadingService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private location: Location) {

      this.sendDatosFormProducto = formBuilder.group({
        codigo: ['', Validators.required],
        codigoBarras: [''],
        nombre: ['', Validators.required],
        pvp: ['', Validators.required],
        costo: [''],
        utilidad: [''],
        stock: [''],
        unidadMedida: [''],
        categoria: [''],
        marca: [''],
        iva: [true],
        activo: [true],
        observacion: ['']
      });
    }
  ngAfterViewInit(): void {
    this.codigoInput.nativeElement.focus();
    this.ref.detectChanges();
  }

  ngOnInit(): void {
    // GET INITIAL DATA 
    const localServiceResponseToken =  
          JSON.parse(sessionStorage.getItem('_valtok') ? sessionStorage.getItem('_valtok')! : '');
    const localServiceResponseUsr = 
          JSON.parse(sessionStorage.getItem('_valuser') ? sessionStorage.getItem('_valuser')! : '');

    this.dataUser = localServiceResponseToken;
    const { token, expire } = this.dataUser;
    this.tokenValidate = { token, expire};

    this.idEmpresa = localServiceResponseUsr._bussId;
    this.rucEmpresa = localServiceResponseUsr._ruc;

    this.getListCategoriasByIdEmpresa(this.idEmpresa, this.tokenValidate);
    this.getListMarcasByIdEmpresa(this.idEmpresa, this.tokenValidate);


    this.route.paramMap.subscribe((params: any) => {

        let idProducto = params.get('id');
        this.idProductoEdit = idProducto;
        if(idProducto){
          this.editMode = true;
          this.titlePage = 'Editar Producto';
          this.getProductoById(idProducto);
          
        }
    });

    this.sendDatosFormProducto.get('categoria')!.valueChanges.subscribe(value => {
      const valueFilter = this.filterCategoria(value || '');
      this.listCategorias = of(valueFilter);
    });

    this.sendDatosFormProducto.get('marca')!.valueChanges.subscribe(value => {    
      const valueFilter = this.filterMarca(value || '');
      this.listMarcas = of(valueFilter);
    });
  }


  private getListCategoriasByIdEmpresa(idEmpresa: any, accessToken: any){
    this.coreService.getCategoriasProductosByIdEmp(idEmpresa, accessToken).subscribe({
      next: (result: any) => {
        this.listCategorias = of(result.data);
        this.listCategoriasData = result.data;
      },
      error: (error: any) => {
      }
    });    
  }

  private getListMarcasByIdEmpresa(idEmpresa: any, accessToken: any){
    this.coreService.getMarcasProductosByIdEmp(idEmpresa, accessToken).subscribe({
      next: (result: any) => {
        this.listMarcas = of(result.data);
        this.listMarcasData = result.data;
      },
      error: (error: any) => {
      }
    });
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


    if(!this.validateIsNumber(sendFormProducto['costo'])){
      sendFormProducto['costo'] = '0';
    }
    if(!this.validateIsNumber(sendFormProducto['utilidad'])){
      sendFormProducto['utilidad'] = '0';
    }

    console.log(sendFormProducto);
    if(this.editMode){
      sendFormProducto['idProducto'] = this.idProductoEdit;
      this.updateDatosProductoApi(sendFormProducto);
    }else{
      this.insertDatosProductoApi(sendFormProducto);
    }
  }

  private getProductoById(idProducto: any){
    let dialogRef = this.loadingService.open();

    this.coreService.getProductoByIdEmp(idProducto, this.idEmpresa, this.tokenValidate).subscribe({
        next: (data: any) =>{
          dialogRef.close();

          const datosProveedor = data.data[0];

          this.sendDatosFormProducto.controls['codigo'].setValue(datosProveedor['prod_codigo']);
          this.sendDatosFormProducto.controls['codigoBarras'].setValue(datosProveedor['prod_codigo_barras']);
          this.sendDatosFormProducto.controls['nombre'].setValue(datosProveedor['prod_nombre']);
          this.sendDatosFormProducto.controls['pvp'].setValue(datosProveedor['prod_pvp']);
          this.sendDatosFormProducto.controls['costo'].setValue(datosProveedor['prod_costo']);
          this.sendDatosFormProducto.controls['utilidad'].setValue(datosProveedor['prod_utilidad']);
          this.sendDatosFormProducto.controls['stock'].setValue(datosProveedor['prod_stock']);
          this.sendDatosFormProducto.controls['unidadMedida'].setValue(datosProveedor['prod_unidad_medida']);
          this.sendDatosFormProducto.controls['categoria'].setValue(datosProveedor['pro_categoria']);
          this.sendDatosFormProducto.controls['marca'].setValue(datosProveedor['prod_marca']);
          this.sendDatosFormProducto.controls['iva'].setValue(datosProveedor['prod_iva_si_no']);
          this.sendDatosFormProducto.controls['activo'].setValue(datosProveedor['prod_activo_si_no']);
          this.sendDatosFormProducto.controls['observacion'].setValue(datosProveedor['prod_observaciones']);

        },
        error: (error) => {
          dialogRef.close();
        }
    });
  }

  private insertDatosProductoApi(sendFormProducto: any){
    let overlayRef = this.loadingService.open();

    this.coreService.insertProductoToBD(sendFormProducto, this.tokenValidate).subscribe({
      next: (data: any) => {

        overlayRef.close();
        if(data.code == 400){
          return;
        }

        this.toastr.success('Producto Guardado', '', {
          timeOut: 3000,
          closeButton: true
        });

        this.resetControlsForm();
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

    this.coreService.updateProductoToBD(sendFormProducto, this.tokenValidate).subscribe({
      next: (data: any) => {

        overlayRef.close();
        if(data.code == 400){
          return;
        }

        this.toastr.success('Producto Actualizado', '', {
          timeOut: 3000,
          closeButton: true
        });

        setTimeout(() => {
          this.router.navigate(['/inventario']);
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


  onLostFocusCalculateUti(){
    const pvp = this.sendDatosFormProducto.controls['pvp'].value as number;
    const costo = this.sendDatosFormProducto.controls['costo'].value as number;
    const utilidad = this.sendDatosFormProducto.controls['utilidad'].value as number;

    // si tengo pvp y costo (entonces calcular Utilidad)
    if((pvp && pvp != null && pvp != undefined) && (costo && costo != null && costo != undefined)){
        const valorUtilidad = ((pvp - costo)/costo) * 100;
        this.sendDatosFormProducto.controls['utilidad'].setValue(valorUtilidad);
        return;
    }
  }

  onLostFocusCalculatePvp(){
    const pvp = this.sendDatosFormProducto.controls['pvp'].value as number;
    const costo = this.sendDatosFormProducto.controls['costo'].value as number;
    const utilidad = this.sendDatosFormProducto.controls['utilidad'].value as number;

    // si tengo costo y utilidad (entonces calcular PVP)
    if((costo && costo != null && costo != undefined) && (utilidad && utilidad != null && utilidad != undefined)){
      const valorPrecio = costo + ((costo * utilidad)/100)
    
      this.sendDatosFormProducto.controls['pvp'].setValue(valorPrecio);
      return;
    }

  }

  //METHODS FOR FILTER CATEGORIA AND PRODUCT
  
  private filterCategoria(categoria: string): string[]{
    const valorFiltrar = categoria.toLowerCase();
    const listraFiltro =  this.listCategoriasData.filter((category: any) => {
      return category.pro_categoria.toLowerCase().includes(valorFiltrar)
    });

    return listraFiltro;
  }
  private filterMarca(marca: string): string[]{
    const valorFiltrar = marca.toLowerCase();
    const listraFiltro =  this.listMarcasData.filter((marca: any) => {
      return marca.prod_marca.toLowerCase().includes(valorFiltrar)
    });

    return listraFiltro;
  }

  private resetControlsForm(){
    this.sendDatosFormProducto.controls['codigo'].setValue('');
    this.sendDatosFormProducto.controls['codigoBarras'].setValue('');
    this.sendDatosFormProducto.controls['nombre'].setValue('');
    this.sendDatosFormProducto.controls['costo'].setValue('0.0');
    this.sendDatosFormProducto.controls['utilidad'].setValue('0.0');
    this.sendDatosFormProducto.controls['pvp'].setValue('0.0');
    this.sendDatosFormProducto.controls['stock'].setValue('');
    this.sendDatosFormProducto.controls['unidadMedida'].setValue('');
    this.sendDatosFormProducto.controls['categoria'].setValue('');
    this.sendDatosFormProducto.controls['marca'].setValue('');
    this.sendDatosFormProducto.controls['observacion'].setValue('');
    this.sendDatosFormProducto.controls['iva'].setValue(true);
    this.sendDatosFormProducto.controls['activo'].setValue(true);

    this.codigoInput.nativeElement.focus();
    this.ref.detectChanges();
  }


  cancelarClick(){
    this.location.back();
  }


  private validateIsNumber(texto: any): boolean{
    console.log(texto);
    const regexOnlyNumber = new RegExp(/^\d+(\.\d{1,2})?$/);
    return regexOnlyNumber.test(texto);
  }
}
