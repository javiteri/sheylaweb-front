import { Component, Renderer2, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';


export interface DialogPaymentFormData {
  checkoutId: string;
}


@Component({
  selector: 'app-dialog-payment-form',
  templateUrl: './dialog-payment-form.component.html',
  styleUrls: ['./dialog-payment-form.component.css']
})
export class DialogPaymentFormComponent {

  checkoutId = '';

  constructor(
    private renderer: Renderer2,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogPaymentFormData
  ){

    

  }

  ngAfterViewInit() {

    this.checkoutId = this.dialogData['checkoutId'];

    console.log(this.checkoutId);
    this.addScriptTag(`https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=${this.checkoutId}`);
  }

  private addScriptTag(src: string): void {
    const script = this.renderer.createElement('script');
    this.renderer.setAttribute(script, 'src', src);
    this.renderer.appendChild(document.head, script);
  }
}
