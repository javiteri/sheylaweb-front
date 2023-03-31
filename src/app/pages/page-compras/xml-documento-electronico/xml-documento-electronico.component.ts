import { Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewContainerRef, ɵɵsetComponentScope } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BuscarProductoCompraDialogComponent } from 'src/app/components/buscar-producto-compra-dialog/buscar-producto-compra-dialog.component';
import { SriBuscarDocumentoXmlComponent } from 'src/app/components/sri-buscar-documento-xml/sri-buscar-documento-xml.component';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import xml2js from 'xml2js';
import { ItemCompraXml } from '../models/ItemCompraXml';
import { ListCompraItemsService } from '../services/list-compra-items.service';

@Component({
  selector: 'app-xml-documento-electronico',
  templateUrl: './xml-documento-electronico.component.html',
  styleUrls: ['./xml-documento-electronico.component.css']
})
export class XmlDocumentoElectronicoComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['Codigo', 'Articulo', 'Cantidad', 'P Unitario','descuento', 'P Total', 'Iva','Existe',
                               'Codigo Interno','Descripcion Interna', /*'action1',*/ 'action2'];
  datasource = new MatTableDataSource<ItemCompraXml>();

  idEmpresa: number = 0;
  rucEmpresa: string = '';
  idUser: number = 0;
  nombreBd: string = '';
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  xmlFacCompraFile!: File;
  xmlFacCompraString: string = ``;

  formDatosDocumentoProveedor: FormGroup;
  datosProveedorXml: any;

  //DATOS PARA LA GENERACION DEL RIDE
  infoTributaria: any;
  infoFactura: any;
  infoAdicional: any;
  infoListDetalle: any;

  isXmlFileLocal = true;
  
  fileInput! : ElementRef<HTMLInputElement>;
  @ViewChild('file') set inputElRef(elRef: ElementRef<HTMLInputElement>){
    if(elRef){
      this.fileInput = elRef;
    }
  }

  btnsri! : ElementRef<HTMLInputElement>;
  @ViewChild('btnsri') set inputButton(elRef: ElementRef<HTMLInputElement>){
    if(elRef){
      this.btnsri = elRef;
    }
  }

  openFileInput = false;
  openSriAutorizacion = false;

  constructor(
    private matDialog: MatDialog,
    public viewContainerRef: ViewContainerRef,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private coreService: ApplicationProvider,
    private productService: ListCompraItemsService,
    private location: Location,
    private router: Router
  ) { 
    this.formDatosDocumentoProveedor = this.formBuilder.group({
      identificacion: [{value: '', disabled: true}, ],
      fecha: [ {value: '', disabled: true}, ],
      documento: [{value: '', disabled: true},],
      proveedor: [{value: '', disabled: true},],
      numero: [{value: '', disabled: true}],
      direccion: [{value: '', disabled: true},],
      autorizacion: [{value: '', disabled: true}]
    });

    if(this.router.getCurrentNavigation()?.extras.state?.['name'] == true){
      this.openFileInput = true;
    }

    if(this.router.getCurrentNavigation()?.extras.state?.['openSri'] == true){
      this.openSriAutorizacion = true;
    }

  }


  ngAfterViewInit(): void{

    if(this.openFileInput){
      this.fileInput.nativeElement.click();
    } 

    if(this.openSriAutorizacion){
      setTimeout(() => {
        this.btnsri.nativeElement.click();
      }, 300);
    }
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
    this.idUser = localServiceResponseUsr._userId;
    this.nombreBd = localServiceResponseUsr._nombreBd;
  }


  onFileChange(file: any){
    if(file.length === 0){
      return;
    }

    let nameFile = file[0].name;
    const mimeType = file[0].type;

    if (mimeType.match(/xml\/*/) == null) {
      //this.mensajeError = `Error tipo de archivo no valido ${mimeType}`;
      //this.limpiarImagen();
      this.toastr.error('Archivo no válido', '', {
        timeOut: 3000,
        closeButton: true
      });

      return;
    }

    this.xmlFacCompraFile = file[0];
    this.analyzeFile();
  }

  private analyzeFile(){

    if(this.xmlFacCompraFile){
      let r = new FileReader();
      r.onload = async (e: any) => {
        let contenido = e.target.result as string;

        let indexFirst = contenido.indexOf('<autorizacion>');
        let indexLast = contenido.indexOf('</autorizacion>') + 15;

        let nuevoContenidoXml = contenido.slice(indexFirst, indexLast);
        const result = await this.parseXMLData(nuevoContenidoXml);

        //Set string in xml file
        this.xmlFacCompraString = contenido as any;
        this.isXmlFileLocal = true;

        this.setDataInForm(result);
      }

      
      r.readAsText(this.xmlFacCompraFile);
    }

  }


  private async parseXMLData(data: string){
    return new Promise((resolve, reject) => {
      try{
        
        let parser = new xml2js.Parser({
          trim: true,
          explicitArray: false
        });
        
        parser.parseString(data, function(err, result) {
          
          let json1 = JSON.stringify(result);
          let json = JSON.parse(json1);
          let comprobanteData = json['autorizacion']['comprobante'];

          //READ CDATA IN XML FILE
          parser.parseString(comprobanteData, function(err1, result1){

            const dataProveeAndDocu = {
              ci: result1['factura']['infoTributaria'].ruc,
              fecha: result1['factura']['infoFactura'].fechaEmision,
              proveedor: result1['factura']['infoTributaria'].razonSocial.replace(/\uFFFD/g, ''),
              numero: `${result1['factura']['infoTributaria'].estab}-${result1['factura']['infoTributaria'].ptoEmi}-${result1['factura']['infoTributaria'].secuencial}`,
              direccion: result1['factura']['infoTributaria'].dirMatriz,
              autorizacion: result1['factura']['infoTributaria'].claveAcceso,
              listDetalle: result1['factura']['detalles'].detalle
            }

            resolve(dataProveeAndDocu);
          });

        });

      }catch(exception: any){
        console.log(exception);
        this.toastr.error('El archivo seleccionado es inválido', '', {
          timeOut: 3000,
          closeButton: true
        });
        reject();
      }
        
    });
  }

  private setDataInForm(data: any){
    
    this.formDatosDocumentoProveedor.controls['identificacion'].setValue(data['ci']);
    this.formDatosDocumentoProveedor.controls['fecha'].setValue(data['fecha']);
    this.formDatosDocumentoProveedor.controls['documento'].setValue('01 FACTURA');
    this.formDatosDocumentoProveedor.controls['proveedor'].setValue(data['proveedor']);
    this.formDatosDocumentoProveedor.controls['numero'].setValue(data['numero']);
    this.formDatosDocumentoProveedor.controls['direccion'].setValue(data['direccion']);
    this.formDatosDocumentoProveedor.controls['autorizacion'].setValue(data['autorizacion']);

    // GET LIST PRINCIPAL CODE TO REQUEST TO API IF EXIST IN DB
    let postData = {
      idEmp: this.idEmpresa,
      listProducts: (data.listDetalle.length == undefined)? [data.listDetalle]: data.listDetalle,
      nombreBd: this.nombreBd
    }

    this.coreService.verifyProductsXml(postData, this.tokenValidate).subscribe({
      next: (data: any) =>{
        this.datasource.data = data.listProductosXml;
      },
      error: (error: any) =>{
        console.log('error verifiycando productos');
        console.log(error);
      }
    });

    this.coreService.searchProveedoresByIdEmpText(this.idEmpresa, data['ci'], this.tokenValidate, this.nombreBd).subscribe({
      next: (dataResult: any) => {
        if(dataResult.data[0]){
          
          this.datosProveedorXml = {
            id: dataResult.data[0].pro_id,
            identificacion: dataResult.data[0].pro_documento_identidad,
            telefono: dataResult.data[0].pro_telefono
          }

        }else{
          // INSERT PROVEEDOR IN DB AND GET ID VALUES
          let proveedorInsert = {
            tipoIdentificacion: 'RUC',
            documentoIdentidad: data['ci'],
            nombreNatural: data['proveedor'],
            razonSocial: data['proveedor'],
            direccion: data['direccion'],
            telefono: '',
            celular: '',
            email: '',
            paginaWeb: '',
            observacion: '',
            identificacionRepre: '',
            nombreRepre: '',
            telefonoRepre: '',
            emailRepre: '',
            direccionRepre: '',
            idEmpresa: 0,
            nombreBd: this.nombreBd
          }
          proveedorInsert['idEmpresa'] = this.idEmpresa;

          this.coreService.insertProveedorToBD(proveedorInsert, this.tokenValidate).subscribe({
            next: (dataProvInsert: any) => {
              console.log('dataProvInsert');
              if(dataProvInsert.code == 400){
                return;
              }
              if(dataProvInsert.isSucess == true){
                this.datosProveedorXml = {
                  id: dataProvInsert.data.id,
                  identificacion: dataProvInsert.data.ciRuc,
                  telefono: dataProvInsert.data.telefono
                } 
              }
            },
            error: (error) => {
              console.log('error insertando proveedor');
            }
          });
          
        }

      },
      error: (error: any) => {
        
      }
    });
  }

  async consultaXmlByAutorizacion(){

    const dialogRef = this.matDialog.open(SriBuscarDocumentoXmlComponent, {
      closeOnNavigation: true,
      viewContainerRef: this.viewContainerRef,
      width: '450px'
    });

  dialogRef.afterClosed().subscribe(result => {
    if(result){

      this.coreService.getXmlSriByNumAutorizacion(result.claveAcceso, this.tokenValidate).subscribe({
        next: async (data: any) =>{


          if(!data.dataXml){
            console.log('error consultando servicio SRI');
            return;
          }
          
          this.xmlFacCompraString = data.dataXml;
          this.isXmlFileLocal = false;

          const indexStart = data.dataXml.search('<factura id="comprobante" ');
          const indexEnd = data.dataXml.indexOf('</factura>') + 10;

          const result = await this.parseXMLSoapService(data.dataXml.substring(indexStart, indexEnd));
          if((result as any).isSucces == false){
            
            this.toastr.error('El archivo es inválido', '', {
              timeOut: 3000,
              closeButton: true
            });

            this.xmlFacCompraString = '';

          }else{

            this.setDataInForm(result);
  
            this.toastr.success('XML cargado correctamente', '', {
              timeOut: 3000,
              closeButton: true
            });
          }
          
        },
        error: (error: any) => {
          console.log('error consultando XML');
        }
      });

    }
  });
  }

  private async parseXMLSoapService(stringXml: string){

    return new Promise((resolve, reject) => {
      try{

        let parser = new xml2js.Parser({
          trim: true,
          explicitArray: false
        });
        
        let indexEnd = stringXml.indexOf('</infoAdicional>');
        if(indexEnd == -1){
          indexEnd = stringXml.indexOf('</detalles>');
        }

        let xmlFinal = stringXml.slice(0, indexEnd + 16);
        
        parser.parseString(`${xmlFinal}</factura>`.replace(/&gt;/g,">"), function(err, result) {
          
          try{
            let json1 = JSON.stringify(result);
            let json = JSON.parse(json1);
            
            const dataProveeAndDocu = {
              ci: json['factura']['infoTributaria'].ruc,
              fecha: json['factura']['infoFactura'].fechaEmision,
              proveedor:  json['factura']['infoTributaria'].razonSocial.replace(/\uFFFD/g, ''),
              numero: `${json['factura']['infoTributaria'].estab}-${json['factura']['infoTributaria'].ptoEmi}-${json['factura']['infoTributaria'].secuencial}`,
              direccion: json['factura']['infoTributaria'].dirMatriz,
              autorizacion: json['factura']['infoTributaria'].claveAcceso,
              listDetalle: json['factura']['detalles'].detalle
            }
            
            
            resolve(dataProveeAndDocu);

          }catch(errores){
            console.log(errores);
            resolve({
              isSucces: false
            });
          }
          
        });
  
      }catch(exception: any){
        this.toastr.error('El archivo seleccionado es inválido', '', {
          timeOut: 3000,
          closeButton: true
        });
        
        resolve({
          isSucces: false
        });
      } 
    });
  }


  generateXmlFile(){
    if(!this.xmlFacCompraString){
      return;
    }

    let file = new Blob([this.xmlFacCompraString], {type: '.txt'});

    let downloadUrl = window.URL.createObjectURL(file);

    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', downloadUrl);
    //link.setAttribute('href', downloadUrl);
    link.setAttribute('download','factura-xml');
    document.body.appendChild(link);
    link.click();
    link.remove();

  }


  convertirEnCompra(){

    if(!this.xmlFacCompraString){
      return;
    }

    //GET DATOS PROVEEDOR AND FACTURA
    const proveedorResp = {
      identificacion: this.formDatosDocumentoProveedor.controls['identificacion'].value,
      fecha: this.formDatosDocumentoProveedor.controls['fecha'].value,
      documento: this.formDatosDocumentoProveedor.controls['documento'].value,
      proveedor: this.formDatosDocumentoProveedor.controls['proveedor'].value,
      numero: this.formDatosDocumentoProveedor.controls['numero'].value,
      direccion: this.formDatosDocumentoProveedor.controls['direccion'].value,
      autorizacion: this.formDatosDocumentoProveedor.controls['autorizacion'].value,
      dataInServer: this.datosProveedorXml
    }

    const listProductExist = this.datasource.data.filter((data: any) => {
      return  data.exist == true
    });

    listProductExist.forEach((elemento: any) => {
      try{
        if(Number(elemento.descuento) > 0){
          // convertir valor de dinero a porcentaje en descuento
          let valorTmp = ((Number(elemento.descuento) / ( Number(elemento.cantidad) * Number(elemento.precioUnitario))) * 100).toFixed(2);
          elemento.descuento = valorTmp
        }
      }catch(exception: any){
        elemento.descuento = '0'
      }
    });

    this.productService.setProductList(listProductExist);
    this.productService.setProveedor(proveedorResp);
    this.location.back();
  }

  buscarProducto(index: number){
    const dialogRef = this.matDialog.open(BuscarProductoCompraDialogComponent, {
      width: '100%',
      closeOnNavigation: true,
      data: {
        selectInOneClick: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){

        const data = this.datasource.data;
        data[index].codigoInterno = result.prod_codigo;
        data[index].descripcionInterna = result.prod_nombre;
        data[index].prodId = result.prod_id;
        data[index].exist = true;

        this.datasource.data = data;
      }
    });
  }

  cancelarClick(){
    this.location.back();
  }

  async verRideClick(){

    if(!this.xmlFacCompraString){
      return;
    }

    if(this.isXmlFileLocal){
      const responseValues =  await this.getValuesFromXmlToPDF();
      if(responseValues){
          this.generatePdfByXmlCompra(responseValues);
      }

    }else{
      const responseValues = await this.getValuesFromXmlToPDFSoap();
      if(responseValues){
        this.generatePdfByXmlCompra(responseValues);
      }
    }

  }

  private getValuesFromXmlToPDF(){
    return new Promise((resolve, reject) => {
      try{

        let parser = new xml2js.Parser({
          trim: true,
          explicitArray: false
        });
        parser.parseString(this.xmlFacCompraString, function(err, result) {
          if(err){
            return;
          }

          //READ CDATA IN XML FILE
          let json1 = JSON.stringify(result);
          let json = JSON.parse(json1);
          let comprobanteData = json['autorizacion']['comprobante'];

          //READ CDATA IN XML FILE
          parser.parseString(comprobanteData, function(err1, result1){

            const dataResponseVentaPdf = {
              infoTributaria: result1['factura']['infoTributaria'],
              infoFactura: result1['factura']['infoFactura'],
              infoAdicional: result1['factura']['infoAdicional'],
              detalles: result1['factura']['detalles'].detalle,
              fechaAutorizacion: json['autorizacion']['fechaAutorizacion']
            }

            resolve(dataResponseVentaPdf);
          });

        });

      }catch(exception: any){
        reject();
      }
        
    });
  }

  private getValuesFromXmlToPDFSoap(){
    return new Promise((resolve, reject) => {
      try{
        
        let parser = new xml2js.Parser({
          trim: true,
          explicitArray: false
        });
        
        let indexStart = this.xmlFacCompraString.indexOf('<autorizacion>'); 
        let indexEnd = this.xmlFacCompraString.indexOf('</autorizacion>');
        let xmlFinal = this.xmlFacCompraString.slice(indexStart, indexEnd + 15);
        
        parser.parseString(`${xmlFinal}`.replace(/&gt;/g,">"), function(err, result) {
          
            let json1 = JSON.stringify(result);
            let json = JSON.parse(json1);
            
            const dataResponseVentaPdf = {
              infoTributaria: json['autorizacion']['comprobante']['factura']['infoTributaria'],
              infoFactura: json['autorizacion']['comprobante']['factura']['infoFactura'],
              infoAdicional: json['autorizacion']['comprobante']['factura']['infoAdicional'],
              detalles: json['autorizacion']['comprobante']['factura']['detalles'].detalle,
              fechaAutorizacion: json['autorizacion']['fechaAutorizacion']
            }
            
            resolve(dataResponseVentaPdf);
          
        });
  
      }catch(exception: any){
        reject();
      } 
    });
  }


  private generatePdfByXmlCompra(datosFactura: any){

    this.coreService.generatePdfXmlCompra(datosFactura, this.tokenValidate).subscribe({
      next: (data: any) => {

        let downloadUrl = window.URL.createObjectURL(data);

        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', downloadUrl);
        //link.setAttribute('href', downloadUrl);
        link.setAttribute('download','detalle-venta');
        document.body.appendChild(link);
        link.click();
        link.remove();

      },
      error: (error: any) => {
        console.log('data error');
        console.log(error);
      }
    });

  }

  private removeAccentDiactricsFromString(texto: string){
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  }
}
