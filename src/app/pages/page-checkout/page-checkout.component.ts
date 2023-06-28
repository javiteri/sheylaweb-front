import { Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { TokenValidate } from 'src/app/interfaces/IWebData';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';
import { DialogPoliticasPrivacidadComponent } from 'src/app/components/dialogs/dialog-politicas-privacidad/dialog-politicas-privacidad.component';
import { DialogTerminosCondicionesComponent } from 'src/app/components/dialogs/dialog-terminos-condiciones/dialog-terminos-condiciones.component';
import { ActivatedRoute } from '@angular/router';
import { VALORIVAPERCENTFORMAT } from '../../common/constants/checkout';

const sheylawebPlans = [{
  id: 1,
  nombre: 'basicplan',
  titulo: 'Básico',
  precio: 25.00,
  isIva: true,
  benefits: [
    '50 Documentos',
    'Usuarios Ilimitados',
    'Soporte Técnico Gratuito'
  ]
},{
  id: 2,
  nombre: 'mediumplan',
  titulo: 'Medio',
  precio: 70.00,
  isIva: true,
  benefits: [
    '200 Documentos',
    'Usuarios Ilimitados',
    'Soporte Técnico Gratuito'
  ]
},{
  id: 3,
  nombre: 'premiumplan',
  titulo: 'Premium',
  precio: 130.00,
  isIva: true,
  benefits: [
    'Documentos Ilimitados',
    'Usuarios Ilimitados',
    'Soporte Técnico Gratuito'
  ]
}];

@Component({
  selector: 'app-page-checkout',
  templateUrl: './page-checkout.component.html',
  styleUrls: ['./page-checkout.component.css']
})
export class PageCheckoutComponent implements OnInit {

  scripTag: HTMLScriptElement | null = null;
  
  titlePage = 'Checkout'
  baseUrl = '';
  ipClient = '0.0.0.0';

  subtotal = '00.00';
  impuestos = '00.00';
  total = '00.00';

  datosUsuario: any = null;
  planSelect: any = null;

  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  isShowPaymentFormDF: boolean = false;

  @ViewChild('wpwl-form', { static: true })
  wpwlFormCard!: ElementRef;

  constructor(
    private renderer: Renderer2,
    private coreService: ApplicationProvider,
    private loadingService: LoadingService,
    public router: ActivatedRoute,
    private matDialog: MatDialog
  ){

    this.router.params.subscribe(params => {
      const datosPlan = params['planselect']

      this.planSelect = sheylawebPlans.find((infoPlan: any) => {
        return infoPlan.nombre == datosPlan;
      });

      this.calculateValuesPlanSelect();
    });
  }


  private calculateValuesPlanSelect(){
    let valorImpuesto = (Number(this.planSelect.precio) * Number(VALORIVAPERCENTFORMAT)) - Number(this.planSelect.precio);
    let valorTotal = Number(this.planSelect.precio) + valorImpuesto;

    this.subtotal =  this.planSelect.precio.toFixed(2);
    this.impuestos = valorImpuesto.toFixed(2);
    this.total = valorTotal.toFixed(2);
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

    this.datosUsuario = localServiceResponseUsr;

    const loadingRef = this.loadingService.open();
    this.coreService.getUsuarioById(this.datosUsuario._userId, this.datosUsuario._bussId, this.tokenValidate, 
                                    this.datosUsuario._nombreBd).subscribe({
      next: (data: any) => {
        this.datosUsuario = data.data[0];
        console.log(this.datosUsuario);
        loadingRef.close();
      },
      error: (error: any) => {
        console.log(error);
        loadingRef.close();
      }
    });

    this.callGetIpClient();
  }

  private addOptionDiferidoPaymentCard() {
    const script = document.createElement('script');
    script.type = 'text/javascript';

    script.innerHTML = `
      var wpwlOptions = {
        onReady: function(){
          var numberOfInstallmentsHtml = '<div class="wpwl-label wpwl-label-custom" style="display:inline-block">Diferidos:</div>' +
            '<div class="wpwl-wrapper wpwl-wrapper-custom" style="display:inline-block">' +
            '<select name="recurring.numberOfInstallments"><option value="0">0</option><option value="3">3</option></select>' +
            '</div>';
          const form = document.querySelector('form.wpwl-form-card');
          form.querySelector('.wpwl-button').insertAdjacentHTML('beforebegin', numberOfInstallmentsHtml);
          
          var tipoCredito =  
          '<div class="wpwl-wrapper wpwl-wrapper-custom" style="display:inline-block">' +
          'Tipo de crédito:<select name="customParameters[SHOPPER_TIPOCREDITO]"><option value="00">Corriente</option>' +
          '<option value="01">Dif Corriente</option>' +
          '<option value="02">Dif con int</option>' +
          '<option value="03">Dif sin int</option>' +
          '<option value="07">Dif con int + Meses gracia</option>' +
          '<option value="01">Dif sin int + Meses gracia</option>' +
          '<option value="01">Dif plus cuotas</option>' +
          '<option value="01">Dif plus</option>' +
          '</div>';

          form.querySelector('.wpwl-button').insertAdjacentHTML('beforebegin', tipoCredito);

          var datafast= '<br/><br><img src='+'"https://www.datafast.com.ec/images/verified.png" style='+'"display:block;margin:0 auto; width:100%;">';
          form.querySelector('.wpwl-button').insertAdjacentHTML('beforebegin', datafast);
        },
        style: "card",
        locale: "es",
        labels: {cvv: "CVV", cardHolder: "Nombre(Igual que en la tarjeta)"}
      };
    `;
    document.head.appendChild(script);

  }


  private callGetIpClient(){
    this.coreService.getIpClient(this.tokenValidate).subscribe({
      next: (data: any) => {
        console.log(data);
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }
  

  finalizarCompra(){
    let dialogRef = this.loadingService.open();

    this.coreService.getCheckoutId(this.tokenValidate, "5.00").subscribe({
      next: (data: any) => {
        dialogRef.close();

        if(data.result.code == "000.200.100"){
          
          this.addScriptTag(`https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=${data.id}`);
          /*this.matDialog.open(DialogPaymentFormComponent, {
            minWidth: '0',
            width: '600px',
            height: '500px',
            data: {
              checkoutId: data.id
            }
          });*/

        }else{
          console.log('error obteniendo el checkoutId');
        }

      },
      error: (error: any) => {
        console.log('error:' + error);
        dialogRef.close();
      }
    });
  }


  private addScriptTag(src: string): void {
    this.scripTag = this.renderer.createElement('script');
    this.renderer.setAttribute(this.scripTag, 'src', src);
    this.renderer.appendChild(document.head, this.scripTag);

    this.isShowPaymentFormDF = true;
    this.addOptionDiferidoPaymentCard();
  }

  submitForm(event: any){
    console.log('submit form');
  }

  ngOnDestroy(): void {
    if (this.scripTag) {  
      this.renderer.removeChild(document.head, this.scripTag);
    }
  }


  private clickPoliticas(){
    this.matDialog.open(DialogPoliticasPrivacidadComponent, {
      width: '60vw',
    });
  }
  clickTerminos(){
    const dialogRef = this.matDialog.open(DialogTerminosCondicionesComponent, {
      width: '60vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.clickPolitica){

          this.clickPoliticas();
        }
      }
    });

  }
}
