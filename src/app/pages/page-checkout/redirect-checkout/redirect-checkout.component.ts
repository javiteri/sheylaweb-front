import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationProvider } from 'src/app/providers/provider';
import { LoadingService } from 'src/app/services/Loading.service';

@Component({
  selector: 'app-redirect-checkout',
  templateUrl: './redirect-checkout.component.html',
  styleUrls: ['./redirect-checkout.component.css']
})
export class RedirectCheckoutComponent {

  id: string = '';
  resourcePath = '';

  constructor(private router: ActivatedRoute,
    private coreService: ApplicationProvider,
    private loadingService: LoadingService){

    this.router.queryParams.subscribe(params => {
      this.id = params['id'];
      this.resourcePath = params['resourcePath'];

      console.log(this.id);
      console.log(this.resourcePath);
      this.getTransactionStatus(this.id, this.resourcePath);
    });
  }


  private getTransactionStatus(id: string, resourcePath: string){

     // GET INITIAL DATA 
     const localServiceResponseToken =  
     JSON.parse(sessionStorage.getItem('_valtok') ? sessionStorage.getItem('_valtok')! : '');

    const { token, expire } = localServiceResponseToken;
    let tokenValidate = { token, expire};

    let dialogLoading = this.loadingService.open();

    this.coreService.getTransactionStatus(tokenValidate, id, resourcePath).subscribe({
      next: (data: any) =>{
        dialogLoading.close();
        console.log(data);
      },
      error: (error: any) => {
        dialogLoading.close();
        console.log(error);
      }
    });

  }
}
