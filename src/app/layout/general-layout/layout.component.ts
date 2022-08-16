import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {BreakpointObserver} from '@angular/cdk/layout'
import { Router, RouterLink } from '@angular/router';
import { Menu, TokenValidate } from 'src/app/interfaces/IWebData';
import { DataStoreService } from 'src/app/services/DataStore.Service';
import { DataStoreGlobalModel } from 'src/app/interfaces/DataStoreGlobalModel';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  idEmpresa: number = 0;
  rucEmpresa: string = '';

  @ViewChild(MatSidenav) sidenav!: MatSidenav;

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
      submenu: [ {name: 'Datos Emprsa', url: '', parametros: []},
      {name: 'Avanzados', url: '', parametros: []},
      {name: 'Datos Emprsa', url: '', parametros: []},
      {name: 'Avanzados', url: '', parametros: []},
      {name: 'Datos Emprsa', url: '', parametros: []},
      {name: 'Avanzados', url: '', parametros: []},
      {name: 'Datos Emprsa', url: '', parametros: []},
      {name: 'Avanzados', url: '', parametros: []},]
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
      routerLink: '',
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
        {name: 'Datos Emprsa', url: 'infoempresa', parametros: [this.idEmpresa, this.rucEmpresa] },
        {name: 'Avanzados', url: '', parametros: [this.idEmpresa, this.rucEmpresa]},
      ]
    }

  ];


  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  constructor(private observer: BreakpointObserver,
    private router: Router,
    private dataStoreService: DataStoreService){}


  ngOnInit(): void {


    this.dataStoreService.globalModel$.subscribe((dataStoreGLobalModel: DataStoreGlobalModel) => {

      if(dataStoreGLobalModel){
          console.log('idEmpresaDataStore: ' + dataStoreGLobalModel.idEmpresa);
          console.log('idUsuarioDataStore: ' + dataStoreGLobalModel.idUser);
          console.log('rucEmpresaDataStore: ' + dataStoreGLobalModel.rucEmpresa);

          this.rucEmpresa = dataStoreGLobalModel.rucEmpresa;
          this.idEmpresa = dataStoreGLobalModel.idEmpresa;

          /*let postData = {
            ruc: this.rucEmpresa,
            idEmpresa: this.idEmpresa
          }*/

      }

    })

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

    localStorage.clear();
    this.router.navigate(['/login']);
  }


  selectMenu(parentMenu: {name: string, routerLink: string; }): void{

    console.log('inside click menu');

    if(parentMenu.routerLink){
      this.router.navigate(['/'+parentMenu.routerLink]);
      console.log('inside router Link');
    }

    this.menus.forEach(menu => {
      if(menu.name !== parentMenu.name){
        menu.active = false;
        console.log(''+menu.name + ' is false');
      }else{
        menu.active = !menu.active;
        console.log(''+menu.name + ' is active');
      }
    })

  }

  selectSubmenu(menu: any): void {
    console.log('submenu router to: ' + menu.parametros);
    //console.log('params: ' + submenu['parametros']);
  }


  routerToDest(routerTo: string){
    console.log('routerTo: ' + routerTo);
    if(routerTo){
      console.log('inside If: ' + routerTo);
    }
  }


}
