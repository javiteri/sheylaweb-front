import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-page-checkout',
  templateUrl: './page-checkout.component.html',
  styleUrls: ['./page-checkout.component.css']
})
export class PageCheckoutComponent {

  titlePage = 'Checkout'
  baseUrl = '';

  constructor(
    private renderer: Renderer2
  ){}

  ngAfterViewInit() {
    setTimeout(() => {
      this.addScriptTag('https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=79E1E1EBB41134A257CB8D22280D6BBC.uat01-vm-tx01');
    }, 2000);
    
  }

  private addScriptTag(src: string): void {
    console.log('agregando');
    console.log(src);
    const script = this.renderer.createElement('script');
    this.renderer.setAttribute(script, 'src', src);
    this.renderer.appendChild(document.head, script);
  }
}
