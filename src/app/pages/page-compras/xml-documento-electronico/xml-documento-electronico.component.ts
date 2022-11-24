import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ProductFactura } from 'src/app/interfaces/ProductFactura';
import { ApplicationProvider } from 'src/app/providers/provider';
import xml2js from 'xml2js';
import { ItemCompraXml } from '../models/ItemCompraXml';

@Component({
  selector: 'app-xml-documento-electronico',
  templateUrl: './xml-documento-electronico.component.html',
  styleUrls: ['./xml-documento-electronico.component.css']
})
export class XmlDocumentoElectronicoComponent implements OnInit {

  displayedColumns: string[] = ['Codigo', 'Articulo', 'Cantidad', 'P Unitario','descuento', 'P Total', 'Iva','Existe',
                               'Codigo Interno','Descripcion Interna', 'action1', 'action2'];
  datasource = new MatTableDataSource<ItemCompraXml>();

  idEmpresa: number = 0;
  rucEmpresa: string = '';
  idUser: number = 0;
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  xmlFacCompraFile!: File;

  formDatosDocumentoProveedor: FormGroup;

  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private coreService: ApplicationProvider
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

  }


  onFileChange(file: any){
    if(file.length === 0){
      console.log('el archivo es valido');
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
        let contenido = e.target.result;
        const result = await this.parseXMLData(contenido);

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
              ci: result1['factura']['infoFactura'].identificacionComprador,
              fecha: result1['factura']['infoFactura'].fechaEmision,
              proveedor: result1['factura']['infoFactura'].razonSocialComprador,
              numero: `${result1['factura']['infoTributaria'].estab}-${result1['factura']['infoTributaria'].ptoEmi}-${result1['factura']['infoTributaria'].secuencial}`,
              direccion: result1['factura']['infoFactura'].direccionComprador,
              autorizacion: result1['factura']['infoTributaria'].claveAcceso,
              listDetalle: result1['factura']['detalles'].detalle
            }

            resolve(dataProveeAndDocu);
          });

        });

      }catch(exception: any){
        console.log('error leyendo el archivo, no cumple estructura');
        this.toastr.error('El archivo seleccionado es inválido', '', {
          timeOut: 3000,
          closeButton: true
        });
        reject();
      }
        
    });
  }

  private setDataInForm(data: any){
    console.log(data);
    this.formDatosDocumentoProveedor.controls['identificacion'].setValue(data['ci']);
    this.formDatosDocumentoProveedor.controls['fecha'].setValue(data['fecha']);
    this.formDatosDocumentoProveedor.controls['documento'].setValue(data['ci']);
    this.formDatosDocumentoProveedor.controls['proveedor'].setValue(data['proveedor']);
    this.formDatosDocumentoProveedor.controls['numero'].setValue(data['numero']);
    this.formDatosDocumentoProveedor.controls['direccion'].setValue(data['direccion']);
    this.formDatosDocumentoProveedor.controls['autorizacion'].setValue(data['autorizacion']);

    // GET LIST PRINCIPAL CODE TO REQUEST TO API IF EXIST IN DB
    let arrayValores = data.listDetalle.map((a: any) => a.codigoPrincipal);

    let postData = {
      idEmp: this.idEmpresa,
      listProducts: data.listDetalle
    }

    this.coreService.verifyProductsXml(postData, this.tokenValidate).subscribe({
      next: (data: any) =>{
        /*console.log('respuesta ok verificando productos');
        console.log(data);*/

        this.datasource.data = data.listProductosXml;
        console.log(this.datasource.data);

      },
      error: (error: any) =>{
        console.log('error verifiycando productos');
        console.log(error);
      }
    });
  }
}
