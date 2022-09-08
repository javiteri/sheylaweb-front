import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import {BreakpointObserver} from '@angular/cdk/layout'
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Menu, TokenValidate } from 'src/app/interfaces/IWebData';
import { DataStoreService } from 'src/app/services/DataStore.Service';
import { DataStoreGlobalModel } from 'src/app/interfaces/DataStoreGlobalModel';
import { filter } from 'rxjs';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  idEmpresa: number = 0;
  rucEmpresa: string = '';

  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  @ViewChild(MatSidenavContent) sidenavcontent!: MatSidenavContent;
  
  menus: Menu[] = [
    {
      name: 'Dashboard',
      matIcon: 'dashboard',
      active: false,
      routerLink: '',
      submenu: []
    },
    {
      name: 'Clientes',
      matIcon: 'people',
      active: false,
      routerLink: '/clientes',
      submenu: [ ]
    },
    {
      name: 'Inventario',
      matIcon: 'shopping_bag',
      active: false,
      routerLink: '/inventario',
      submenu: []
    }
    ,
    {
      name: 'Ventas',
      matIcon: 'receipt_long',
      active: false,
      routerLink: '/ventas',
      submenu: []
    }
    ,
    {
      name: 'Proveedores',
      matIcon: 'local_shipping',
      active: false,
      routerLink: '/proveedores',
      submenu: []
    },
    {
      name: 'Compras',
      matIcon: 'shopping_cart',
      active: false,
      routerLink: '/compras',
      submenu: []
    },
    {
      name: 'Configurar',
      matIcon: 'settings',
      active: false,
      routerLink: '',
      submenu: [
        {name: 'Datos Empresa', url: 'infoempresa'},
        {name: 'Usuarios', url: 'usuarios'},
        {name: 'Avanzados', url: ''},
      ]
    }

  ];


  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  constructor(private observer: BreakpointObserver,
    private router: Router,
    private dataStoreService: DataStoreService){
    }


  ngOnInit(): void {

    this.router.events
        // For newer versions or rxjs use a pipe on the filter:
         .pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
           this.sidenavcontent.getElementRef().nativeElement.scrollTop = 0;
          });
    /*this.dataStoreService.globalModel$.subscribe((dataStoreGLobalModel: DataStoreGlobalModel) => {

      if(dataStoreGLobalModel){
          console.log('idEmpresaDataStore: ' + dataStoreGLobalModel.idEmpresa);
          console.log('idUsuarioDataStore: ' + dataStoreGLobalModel.idUser);
          console.log('rucEmpresaDataStore: ' + dataStoreGLobalModel.rucEmpresa);

          this.rucEmpresa = dataStoreGLobalModel.rucEmpresa;
          this.idEmpresa = dataStoreGLobalModel.idEmpresa;

          /*let postData = {
            ruc: this.rucEmpresa,
            idEmpresa: this.idEmpresa
          }

      }

    })*/

  }

  ngAfterViewInit(){
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {

      if(res.matches){
        this.sidenav.mode = 'over';
        this.sidenav.close();
      }else{
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }

    });
  }


  logout(){

    console.log('logout');
    localStorage.clear();
    this.router.navigate(['/login']);
  }


  selectMenu(parentMenu: {name: string, routerLink: string; }): void{

    if(parentMenu.routerLink){
      this.router.navigate(['/'+parentMenu.routerLink]);
    }

    this.menus.forEach(menu => {
      if(menu.name !== parentMenu.name){
        menu.active = false;
      }else{
        menu.active = !menu.active;
      }
    })

  }

  selectSubmenu(submenu: any): void {
    if(submenu.url){
      this.router.navigate(['/'+submenu.url]);
    }
  }


}
